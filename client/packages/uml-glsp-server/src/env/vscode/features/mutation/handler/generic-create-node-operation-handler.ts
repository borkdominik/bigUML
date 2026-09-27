/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    getContainmentProperty,
    getDefaultProperties,
    getDefaultSize,
    getElementMetadata,
    hasNoName,
    isFloatingType,
    isNoBounds,
    isOwnedElementType
} from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import {
    createRandomUUID,
    findAvailableNodeName,
    type SerializeAstNode,
    type SerializedRecordNode
} from '@borkdominik-biguml/uml-model-server';
import { type Bounds, type Node } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type Command,
    CreateNodeOperation,
    type CreateNodeOperationHandler,
    getRelativeLocation,
    type GModelElement,
    OperationHandler,
    Point,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import type * as jsonpatch from 'fast-json-patch';
import { inject, injectable, multiInject, optional } from 'inversify';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { GridSnapper } from '../../grid/grid-snapper.js';
import { ownLaneId } from '../../../elements/activity-partition.element.js';
import { freeformCompartmentId } from '../../../elements/core/freeform-compartment.js';
import { DiagramLanguageMetadata } from '../../model/diagram-language-metadata.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';
import { MutationExtension } from '../extension/mutation-extension.js';
import { coalesceLayoutPatches } from '../model-patch.js';

/**
 * The diagram's own list of nodes, which is where every node that stands on the canvas lives - and
 * never the empty path: that is the whole document in JSON Patch, so an `add` against it would replace
 * the model with the one new node.
 */
const DIAGRAM_ENTITIES = '/diagram/entities/-';

/** The gmodel type of the canvas itself, which a drop on empty space names as its container. */
const GRAPH_TYPE = 'graph';

/** A node as this handler writes it: a record carrying at least its type and id. */
type CreatedNode = SerializedRecordNode & { $type: string; __id: string };

/**
 * Creates a node of any type: names it, gives it its defaults, puts it where it belongs in the model,
 * and stores where it was dropped in its `bounds`. What kind of node it is comes from the generated element metadata;
 * what one node does differently on top of that comes from the {@link MutationExtension}s.
 */
@injectable()
export class GenericCreateNodeOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    declare readonly modelState: DiagramModelState;

    @inject(DiagramLanguageMetadata)
    protected readonly metadata: DiagramLanguageMetadata;

    @multiInject(MutationExtension)
    @optional()
    protected readonly extensions: MutationExtension[] = [];

    get elementTypeIds(): string[] {
        return this.metadata.nodeTypeIds;
    }

    override label: string = '';

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    override createCommand(dropped: CreateNodeOperation): Command | undefined {
        const operation = this.onOwner(dropped);
        const containerPath = this.resolveContainerPath(operation);

        // An element UML only lets exist inside an owner has nowhere to be on the canvas by itself, so a
        // drop that resolves to the canvas is refused rather than creating it at the origin on top of
        // whatever is already there.
        if (isOwnedElementType(operation.elementTypeId) && containerPath === DIAGRAM_ENTITIES) {
            return undefined;
        }

        const node = this.createNode(operation);
        const created = { operation, containerPath, node };
        const patch: jsonpatch.Operation[] = coalesceLayoutPatches([
            { op: 'add', path: containerPath, value: node as SerializeAstNode<Node> },
            ...this.extensions.flatMap(extension => extension.afterNodeCreated?.(created) ?? [])
        ]);

        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    /** The node as it is written into the model: its type, id, name, defaults, and the children it opens with. */
    protected createNode(operation: CreateNodeOperation): CreatedNode {
        // The node and the children it opens with are written by this one patch, so the names already
        // handed out have to be carried along - the diagram has none of them yet and would hand out the
        // same twice.
        const claimedNames = new Set<string>();
        const astType = this.metadata.convertToAst(operation.elementTypeId) as Node['$type'];
        const node: CreatedNode = { $type: astType, __id: createRandomUUID(astType) };

        // Only where the element has somewhere to put one. A note is the text it holds and carries no
        // name at all, and a `name` written onto one goes into the file as a property the grammar has no
        // rule for - swallowed by the unknown-property rule on the next read and gone.
        if (!hasNoName(astType)) {
            node.name = this.claimName(astType, claimedNames);
        }

        for (const { property, defaultValue } of getDefaultProperties(operation.elementTypeId)) {
            if (property !== 'name' && node[property] === undefined) {
                node[property] = defaultValue;
            }
        }

        // Written straight into the element rather than as patch operations of their own: what a node
        // opens with is part of what the shape *is*, and one `add` carrying them keeps that true of the
        // file as well.
        const opensWith = getElementMetadata(astType)?.opensWith;
        if (opensWith) {
            node[opensWith.property] = Array.from({ length: opensWith.count }, () => ({
                $type: astType,
                __id: createRandomUUID(astType),
                name: this.claimName(astType, claimedNames)
            }));
        }

        const bounds = this.createBounds(operation);
        if (bounds) {
            node.bounds = bounds;
        }

        return node;
    }

    protected claimName(astType: string, claimedNames: Set<string>): string {
        const name = findAvailableNodeName(this.modelState.semanticRoot, `New${astType}`, claimedNames);
        claimedNames.add(name);
        return name;
    }

    /** Where the node was dropped and how big it opens - nothing for an element placed by its owner. */
    protected createBounds(operation: CreateNodeOperation): SerializeAstNode<Bounds> | undefined {
        if (isNoBounds(operation.elementTypeId)) {
            return undefined;
        }
        const location = GridSnapper.snap(this.getRelativeLocation(operation)) ?? Point.ORIGIN;
        return { $type: 'Bounds', x: location.x, y: location.y, ...getDefaultSize(operation.elementTypeId) };
    }

    protected getLocation(operation: CreateNodeOperation): Point | undefined {
        return operation.location;
    }

    protected getRelativeLocation(operation: CreateNodeOperation): Point | undefined {
        const absoluteLocation = this.getLocation(operation) ?? Point.ORIGIN;
        return getRelativeLocation(absoluteLocation, this.getPositioningContainer(operation));
    }

    /**
     * The element the new node's location is made relative to.
     *
     * A node on the canvas is placed relative to the graph. A node in a container is drawn by it, the way
     * a package draws what it holds, and placed relative to where the container draws it.
     */
    protected getPositioningContainer(operation: CreateNodeOperation): GModelElement {
        const container = this.getContainer(operation);
        const containerType = operation.containerId ? this.containerType(operation.containerId) : undefined;
        if (!container || !containerType || containerType === GRAPH_TYPE) {
            return this.modelState.root;
        }
        // Where the container already draws what it holds, it is that compartment the new node is placed
        // in - below the container's name, not at its corner.
        return (
            this.modelState.index.find(freeformCompartmentId(container.id)) ??
            this.modelState.index.find(freeformCompartmentId(ownLaneId(container.id))) ??
            container
        );
    }

    /**
     * The drop as made on the element that owns the compartment it landed in. A compartment a container
     * draws its nodes in, or the lane of a partition without lanes, is not an element; what is dropped
     * there is put in the nearest element it is drawn for.
     */
    protected onOwner(operation: CreateNodeOperation): CreateNodeOperation {
        if (!operation.containerId || this.modelState.index.findIdElement(operation.containerId)) {
            return operation;
        }
        let drawn = this.modelState.index.find(operation.containerId);
        while (drawn && !this.modelState.index.findIdElement(drawn.id)) {
            drawn = 'parent' in drawn ? (drawn as { parent?: GModelElement }).parent : undefined;
        }
        return drawn && drawn.type !== GRAPH_TYPE ? { ...operation, containerId: drawn.id } : operation;
    }

    protected getContainer(operation: CreateNodeOperation): GModelElement | undefined {
        // `find` rather than `get`, which throws on an id it does not hold: a drop names its container by
        // an id that came from the client, so a stale one should leave the node on the canvas rather than
        // fail the whole operation.
        return operation.containerId ? this.modelState.index.find(operation.containerId) : undefined;
    }

    /**
     * What the container *is*, rather than how it happens to be drawn.
     *
     * A container is not always a node: a region of a composite state is a compartment of that state,
     * so its gmodel type says nothing about what may be put in it. Its semantic type does, and it is
     * the semantic model the new element is written into.
     */
    protected containerType(containerId: string): string | undefined {
        return this.modelState.index.findIdElement(containerId)?.$type ?? this.modelState.index.find(containerId)?.type;
    }

    /** The JSON pointer the new node is added at. */
    protected resolveContainerPath(operation: CreateNodeOperation): string {
        // Asked before anything about the container, because for these the container does not come
        // into it: a note is in nothing, wherever it was dropped.
        if (isFloatingType(operation.elementTypeId) || !operation.containerId) {
            return DIAGRAM_ENTITIES;
        }

        const containerType = this.containerType(operation.containerId);
        const containerPath = this.modelState.index.findPath(operation.containerId);
        if (!containerType || containerType === GRAPH_TYPE || !containerPath) {
            return DIAGRAM_ENTITIES;
        }

        const property = getContainmentProperty(containerType, operation.elementTypeId);
        const ownPath = property ? `${containerPath}/${property}/-` : undefined;

        // A drop the container cannot take becomes a flat entity of the diagram.
        return ownPath ?? DIAGRAM_ENTITIES;
    }
}
