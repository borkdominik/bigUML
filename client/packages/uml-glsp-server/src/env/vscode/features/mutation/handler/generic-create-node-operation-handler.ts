/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { getCreationPath, getDefaultProperties, isNoBounds } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import {
    createRandomUUID,
    findAvailableNodeName,
    type SerializeAstNode,
    type SerializedRecordNode
} from '@borkdominik-biguml/uml-model-server';
import { isState, type MetaInfo, type Node } from '@borkdominik-biguml/uml-model-server/grammar';
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
import { inject, injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { stateSizeWithRegions } from '../../../elements/state.element.js';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { GridSnapper } from '../../grid/grid-snapper.js';
import { DiagramLanguageMetadata } from '../../model/diagram-language-metadata.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

const DEFAULT_NODE_SIZE = { width: 80, height: 30 };

/** Node types that need a bigger default size than the generic fallback to read well on the canvas. */
const NODE_SIZE_OVERRIDES: Record<string, { width: number; height: number }> = {
    Subject: { width: 400, height: 600 },
    UseCase: { width: 140, height: 85 },
    State: { width: 160, height: 70 },
    StateMachine: { width: 800, height: 600 },
    // A region is the area a row of states is drawn on rather than a box holding a name, matching
    // `GRegionNodeElement`. Without an entry of its own it opened at the generic 80 by 30 - below the
    // floor a region is drawn at, so every one of them came out the same minimum size.
    Region: { width: 600, height: 240 },
    // A fork/join is a bar rather than a box - see `GForkJoinNodeElement`, which opens at the same size.
    Fork: { width: 120, height: 10 },
    Join: { width: 120, height: 10 },
    ForkNode: { width: 120, height: 10 },
    JoinNode: { width: 120, height: 10 },
    // An action is a box holding its name, and a name that runs to a second line is the normal case -
    // matching `GOpaqueActionNodeElement`, which places its pins against exactly this size.
    OpaqueAction: { width: 80, height: 60 },
    // The two signal actions, matching `DEFAULT_EVENT_ACTION_SIZE`. Wider than a plain action because
    // half their height is given over to the notch, leaving that much less room for the name.
    AcceptEventAction: { width: 140, height: 60 },
    SendSignalAction: { width: 140, height: 60 },
    // The buffer node is the action's box with square corners, so it opens at the same size.
    CentralBufferNode: { width: 80, height: 60 },
    // A parameter node holds its name on one line, matching `GActivityParameterNodeNodeElement`.
    ActivityParameterNode: { width: 120, height: 50 },
    // The activity is the frame its flow is drawn inside, matching `GActivityNodeElement`.
    Activity: { width: 600, height: 400 },
    // A partition is a swimlane, opening with two bands - matching `GActivityPartitionNodeElement`.
    ActivityPartition: { width: 600, height: 300 },
    // The pseudostates drawn as a small mark of their own - the two histories, the two points on a
    // state's border and the terminate cross - matching `GPseudostateMarkNodeElement`. Square, because
    // the mark is drawn to the shorter side and the node's bounds are what a transition anchors to: at
    // the generic 80 by 30 the mark comes out 30 across in the middle of a box nearly three times as
    // wide, and the transition stops on the side of that box, a clear 25 pixels short of the shape.
    DeepHistory: { width: 30, height: 30 },
    ShallowHistory: { width: 30, height: 30 },
    ExitPoint: { width: 30, height: 30 },
    EntryPoint: { width: 30, height: 30 },
    Terminate: { width: 30, height: 30 },
    // The branch diamonds, likewise matching `GDiamondNodeElement`.
    Choice: { width: 40, height: 40 },
    DecisionNode: { width: 40, height: 40 },
    MergeNode: { width: 40, height: 40 }
};

/**
 * Node types that only visually contain other nodes through absolute position/size overlap
 * on the canvas (the diagram model renders `diagram.entities` flatly). Creating a node "inside"
 * one of these must still add it as a flat sibling, never nested into the container's own
 * containment property (e.g. `Subject.useCases`, `StateMachine.regions`, `ActivityPartition.nodes`) -
 * such nested nodes are never traversed by the gmodel factory and would silently disappear from the
 * rendered diagram, while staying in the file where nothing on the canvas can select or delete them.
 */
const FLAT_CONTAINER_TYPES = new Set<string>([
    'Subject',
    'StateMachine',
    'Interaction',
    'Activity',
    'ActivityPartition',
    // A composite state contains its substates the same way: they are drawn over its region bands, which
    // are compartments of the state and hold nothing themselves (see `GStateRegionCompartment`). Listing
    // it here is also what stops a substate dropped on a state from resolving to no containment property
    // at all, which is a patch path of `''` - the whole document.
    'State'
]);

/**
 * The lanes a node of this type opens with, held in a containment property of its own.
 *
 * A swimlane with one band in it is just a box with its name turned sideways, so a partition opens with
 * two. They are `subpartitions` of the one partition rather than partitions in their own right: the
 * shape on the canvas stays a single thing to move, resize and delete, and its lanes cannot drift apart.
 */
const NODE_OPENING_LANES: Record<string, { property: string; count: number }> = {
    ActivityPartition: { property: 'subpartitions', count: 2 }
};

@injectable()
export class GenericCreateNodeOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    declare readonly modelState: DiagramModelState;

    @inject(DiagramLanguageMetadata)
    protected readonly metadata: DiagramLanguageMetadata;

    get elementTypeIds(): string[] {
        return this.metadata.nodeTypeIds;
    }

    override label: string = '';

    getTriggerActions(): TriggerNodeCreationAction[] {
        console.log('Available element types for creation:', this.elementTypeIds);
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    override createCommand(operation: CreateNodeOperation): Command | undefined {
        // An element that stores no bounds is placed by whatever owns it - a pin by its action - so it
        // has nowhere to be on the canvas itself. Dropped anywhere else it used to be created all the
        // same, as a flat entity with no position, which put it at the origin on top of whatever was
        // already there. Refusing is what a drop outside its container should do.
        if (isNoBounds(operation.elementTypeId) && !this.isNestedInContainer(operation)) {
            return undefined;
        }

        // The element and its opening lanes are written by this one patch, so the names already handed out
        // have to be carried along - the diagram has none of them yet and would hand out the same twice.
        const claimedNames = new Set<string>();
        const documentPath = URI.parse(this.modelState.semanticUri).path;
        const semanticPatch = this.createSemantic(operation, claimedNames);
        const metaPatch = this.createMeta(operation, semanticPatch.value.__id, documentPath);
        const patch: jsonpatch.Operation[] = [semanticPatch, ...metaPatch, ...this.openStateForRegion(operation, documentPath)];

        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    /**
     * Opens a state into the frame it becomes when it is given a region, where that is what this operation
     * is doing - nothing at all for every other creation.
     *
     * A state is drawn as a box holding its name and it stores the size of one from the moment it is
     * created, which is the size it keeps: a stored width is the user's and nothing overrides it. But a
     * state with a region in it is not that box any more, it is the frame its substates stand inside, and
     * the one moment it is fair to resize it for them is the moment it stops being the one and starts
     * being the other. Without this the first region left the state at the width of its own name, a slot
     * too narrow to put a substate in, and every composite state had to be dragged open by hand.
     *
     * Only for a region that is actually going *into* the state: the same drop carrying a location makes
     * a region of the diagram drawn on top of the state instead (see `FLAT_CONTAINER_TYPES`), and that one
     * is not a band of it and must not resize it. `resolveContainerPath` is what decides between the two,
     * so it is asked rather than second-guessed.
     */
    protected openStateForRegion(operation: CreateNodeOperation, documentPath: string): jsonpatch.Operation[] {
        if (!operation.containerId) {
            return [];
        }

        const state = this.modelState.index.findIdElement(operation.containerId);
        const statePath = state && this.modelState.index.findPath(state.__id);
        if (!isState(state) || !statePath || this.resolveContainerPath(operation) !== `${statePath}/regions/-`) {
            return [];
        }

        const stored = this.modelState.index.findSize(state.__id);
        const sizePath = this.modelState.index.findSizePath(state.__id);
        // The region this operation adds is not on the state yet, so it is counted in here.
        const size = stateSizeWithRegions(stored, state, (state.regions?.length ?? 0) + 1);

        return [
            {
                op: sizePath && stored ? 'replace' : 'add',
                path: sizePath ?? '/metaInfos/-',
                value: {
                    $type: 'Size',
                    __id: `size_${state.__id}`,
                    element: {
                        $ref: {
                            __id: state.__id,
                            __documentUri: stored?.element?.$nodeDescription?.documentUri.path ?? documentPath
                        }
                    },
                    width: size.width,
                    height: size.height
                }
            } as jsonpatch.Operation
        ];
    }

    /** Whether the drop landed on an element that takes this type as one of its own contents. */
    protected isNestedInContainer(operation: CreateNodeOperation): boolean {
        const containerPath = this.resolveContainerPath(operation);
        return containerPath !== '' && containerPath !== '/diagram/entities/-';
    }

    protected createSemantic(
        operation: CreateNodeOperation,
        claimedNames: Set<string> = new Set()
    ): jsonpatch.AddOperation<SerializeAstNode<Node>> {
        const newName = findAvailableNodeName(
            this.modelState.semanticRoot,
            'New' + this.stripPrefix(operation.elementTypeId),
            claimedNames
        );
        claimedNames.add(newName);
        const containerPath = this.resolveContainerPath(operation);
        const astType = this.metadata.convertToAst(operation.elementTypeId) as Node['$type'];

        const id = createRandomUUID(astType);

        const nodeValue: SerializedRecordNode = {
            $type: astType,
            __id: id,
            name: newName
        };

        const allProps = getDefaultProperties(operation.elementTypeId);
        for (const { property, defaultValue } of allProps) {
            if (property !== 'name' && nodeValue[property] === undefined) {
                nodeValue[property] = defaultValue;
            }
        }

        // Written straight into the element rather than as patch operations of their own: a lane is part
        // of what the shape *is*, and one `add` carrying them keeps that true of the file as well.
        const opening = NODE_OPENING_LANES[this.stripPrefix(operation.elementTypeId)];
        if (opening) {
            nodeValue[opening.property] = Array.from({ length: opening.count }, () => {
                const laneName = findAvailableNodeName(this.modelState.semanticRoot, 'New' + astType, claimedNames);
                claimedNames.add(laneName);
                return { $type: astType, __id: createRandomUUID(astType), name: laneName };
            });
        }

        return {
            op: 'add',
            path: containerPath,
            value: nodeValue as SerializeAstNode<Node>
        };
    }

    protected createMeta(
        operation: CreateNodeOperation,
        id: string,
        nodeDocumentUri: string
    ): jsonpatch.AddOperation<SerializeAstNode<MetaInfo>>[] {
        const location = GridSnapper.snap(this.getRelativeLocation(operation));
        const { width, height } = NODE_SIZE_OVERRIDES[this.stripPrefix(operation.elementTypeId)] ?? DEFAULT_NODE_SIZE;
        const patch: jsonpatch.AddOperation<SerializeAstNode<MetaInfo>>[] = [
            {
                op: 'add',
                path: '/metaInfos/-',
                value: {
                    $type: 'Size',
                    __id: 'size_' + id,
                    element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                    width,
                    height
                }
            },
            {
                op: 'add',
                path: '/metaInfos/-',
                value: {
                    $type: 'Position',
                    element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                    __id: 'pos_' + id,
                    x: location?.x ?? 0,
                    y: location?.y ?? 0
                }
            }
        ];

        return isNoBounds(operation.elementTypeId) ? [] : patch;
    }

    protected getLocation(operation: CreateNodeOperation): Point | undefined {
        return operation.location;
    }

    protected getRelativeLocation(operation: CreateNodeOperation): Point | undefined {
        const absoluteLocation = this.getLocation(operation) ?? Point.ORIGIN;
        return getRelativeLocation(absoluteLocation, this.getPositioningContainer(operation));
    }

    /**
     * The element the new node's location is made relative to. A node created inside a flat container
     * (see {@link FLAT_CONTAINER_TYPES}) becomes an absolutely positioned sibling of that container rather
     * than a real child, so its location must stay relative to the graph - making it relative to the
     * container would shift it by the container's own origin and drop it off its intended spot.
     */
    protected getPositioningContainer(operation: CreateNodeOperation): GModelElement {
        const container = this.getContainer(operation);
        if (!container || (container.type && FLAT_CONTAINER_TYPES.has(this.stripPrefix(container.type)))) {
            return this.modelState.root;
        }
        return container;
    }

    protected getContainer(operation: CreateNodeOperation): GModelElement | undefined {
        const index = this.modelState.index;
        // `find` rather than `get`, which throws on an id it does not hold. The callers all read this as
        // optional, and a drop names its container by an id that came from the client - so a stale one
        // should leave the node on the canvas, not fail the whole operation.
        return operation.containerId ? index.find(operation.containerId) : undefined;
    }

    /**
     * What the container *is*, rather than how it happens to be drawn.
     *
     * A container is not always a node: a region of a composite state is a compartment of that state
     * (see `GStateRegionCompartment`), so its gmodel type is `comp` and says nothing about what may be
     * put in it. Its semantic type does, and it is the semantic model the new element is written into.
     * For everything drawn as a node the two agree, the gmodel type being the semantic one with the
     * representation prefixed - which is what `stripPrefix` takes back off.
     */
    protected containerType(containerId: string): string | undefined {
        const semantic = this.modelState.index.findIdElement(containerId)?.$type;
        return semantic ?? this.modelState.index.find(containerId)?.type;
    }

    protected resolveContainerPath(operation: CreateNodeOperation): string {
        if (operation.containerId) {
            const container = { type: this.containerType(operation.containerId) };
            const containerPath = this.modelState.index.findPath(operation.containerId);

            // Asked before the flat-container rule below, for the two things that belong *in* the named
            // container rather than on the canvas beside it.
            //
            // An element that stores no bounds is written on its owner - an activity's parameters are rows
            // on its frame, which the gmodel factory reads straight off the containment property.
            //
            // A request carrying no drop location came from the property palette, which names its
            // container outright: its `+` adds to that element's own list. A drop from the canvas always
            // carries the point it landed on, and that is what the flat-container rule below is about -
            // a node dropped *onto* a shape, which must stay a flat sibling drawn on top of it.
            //
            // Diverting either to `/diagram/entities/-` stores it where nothing lists it, and for a
            // no-bounds element `createCommand` then refuses the operation outright - which is what left
            // the palette's `+` doing nothing at all.
            if (container?.type && (isNoBounds(operation.elementTypeId) || operation.location === undefined)) {
                const creationProperty = getCreationPath(container.type, operation.elementTypeId);
                if (creationProperty) {
                    return containerPath + '/' + creationProperty + '/-';
                }
            }

            if (container?.type === 'graph' || (container?.type && FLAT_CONTAINER_TYPES.has(this.stripPrefix(container.type)))) {
                return '/diagram/entities/-';
            }

            if (container?.type) {
                const creationProperty = getCreationPath(container.type, operation.elementTypeId);
                if (creationProperty) {
                    return containerPath + '/' + creationProperty + '/-';
                }
            }
        }

        // A drop the container cannot take becomes a flat entity of the diagram, which is where every
        // node in this editor lives anyway. Never the empty path: that is the whole document in JSON
        // Patch, so an `add` against it would have replaced the model with the one new node.
        return '/diagram/entities/-';
    }

    protected stripPrefix(name: string): string {
        return name.replace(/^.*?__/, '');
    }
}
