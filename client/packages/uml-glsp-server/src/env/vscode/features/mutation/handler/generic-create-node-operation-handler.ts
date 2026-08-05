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
import type { MetaInfo, Node } from '@borkdominik-biguml/uml-model-server/grammar';
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
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { GridSnapper } from '../../grid/grid-snapper.js';
import { DiagramLanguageMetadata } from '../../model/diagram-language-metadata.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

const DEFAULT_NODE_SIZE = { width: 80, height: 30 };

/** Node types that need a bigger default size than the generic fallback to read well on the canvas. */
const NODE_SIZE_OVERRIDES: Record<string, { width: number; height: number }> = {
    Subject: { width: 400, height: 600 },
    UseCase: { width: 160, height: 100 }
};

/**
 * Node types that only visually contain other nodes through absolute position/size overlap
 * on the canvas (the diagram model renders `diagram.entities` flatly). Creating a node "inside"
 * one of these must still add it as a flat sibling, never nested into the container's own
 * containment property (e.g. `Subject.useCases`) - such nested nodes are never traversed by the
 * gmodel factory and would silently disappear from the rendered diagram.
 */
const FLAT_CONTAINER_TYPES = new Set<string>(['Subject']);

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

    override createCommand(operation: CreateNodeOperation): Command {
        const semanticPatch = this.createSemantic(operation);
        const metaPatch = this.createMeta(operation, semanticPatch.value.__id, URI.parse(this.modelState.semanticUri).path);

        return new ModelPatchCommand(this.modelState, JSON.stringify([semanticPatch, ...metaPatch]));
    }

    protected createSemantic(operation: CreateNodeOperation): jsonpatch.AddOperation<SerializeAstNode<Node>> {
        const newName = findAvailableNodeName(this.modelState.semanticRoot, 'New' + this.stripPrefix(operation.elementTypeId));
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
        const container = this.getContainer(operation) ?? this.modelState.root;
        const absoluteLocation = this.getLocation(operation) ?? Point.ORIGIN;
        return getRelativeLocation(absoluteLocation, container);
    }

    protected getContainer(operation: CreateNodeOperation): GModelElement | undefined {
        const index = this.modelState.index;
        return operation.containerId ? index.get(operation.containerId) : undefined;
    }

    protected resolveContainerPath(operation: CreateNodeOperation): string {
        if (operation.containerId) {
            const container = this.modelState.index.find(operation.containerId);
            const containerPath = this.modelState.index.findPath(operation.containerId);
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
        return '';
    }

    protected stripPrefix(name: string): string {
        return name.replace(/^.*?__/, '');
    }
}
