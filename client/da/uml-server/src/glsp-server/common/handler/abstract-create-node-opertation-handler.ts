/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { createRandomUUID } from '@borkdominik-biguml/model-service';
import {
    Command,
    CreateNodeOperation,
    CreateNodeOperationHandler,
    OperationHandler,
    Point,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { URI } from 'vscode-uri';
import { findAvailableNodeName } from '../../../language-server/yo-generated/util/name-util.js';
import { BigUmlCommand } from '../../biguml/index.js';
import { astTypes } from '../../util/model-types.js';
import { getCreationPath } from '../../yo-generated/getCreationPath.js';
import { getProperties, isNoBounds } from '../../yo-generated/getDefaultValue.js';
import { BaseDiagramModelState } from '../model/base-diagram-model-state.js';
import { GridSnapper } from './grid-snapper.js';

export abstract class AbstractCreateNodeOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    abstract override readonly modelState: BaseDiagramModelState;

    abstract get elementTypeIds(): string[];

    override label: string = '';

    override createCommand(operation: CreateNodeOperation): Command {
        const modelPatch = this.createNode(operation);
        const nodeId = JSON.parse(modelPatch).value.__id;
        const modelDetailsPatch = this.createNodeDetails(operation, nodeId, URI.parse(this.modelState.semanticUri).path);
        const patch = [JSON.parse(modelPatch), ...JSON.parse(modelDetailsPatch)];
        return new BigUmlCommand(this.modelState, JSON.stringify(patch));
    }

    createNodeDetails(operation: CreateNodeOperation, id: string, nodeDocumentUri: string): string {
        const location = this.getLocation(operation);
        const patch = [
            {
                op: 'add',
                path: '/metaInfos/-',
                value: {
                    $type: 'Size',
                    __id: 'size_' + id,
                    element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                    width: 80,
                    height: 30
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
        return isNoBounds(operation.elementTypeId) ? '[]' : JSON.stringify(patch);
    }

    getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    createNode(operation: CreateNodeOperation): string {
        const newName = findAvailableNodeName(this.modelState.semanticRoot, 'New' + this.stripPrefix(operation.elementTypeId));
        const id = createRandomUUID();
        const containerPath = this.resolveContainerPath(operation);
        const astType = astTypes.convertToAst(operation.elementTypeId);

        const nodeValue: any = {
            $type: astType,
            __id: id,
            name: newName
        };

        const allProps = getProperties(operation.elementTypeId);
        for (const { property, defaultValue } of allProps) {
            if (property !== 'name' && nodeValue[property] === undefined) {
                nodeValue[property] = defaultValue;
            }
        }

        return JSON.stringify({
            op: 'add',
            path: containerPath,
            value: nodeValue
        });
    }

    resolveContainerPath(operation: CreateNodeOperation): string {
        if (operation.containerId) {
            const container = this.modelState.index.find(operation.containerId);
            const containerPath = this.modelState.index.findPath(operation.containerId);
            if (container?.type === 'graph') {
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

    stripPrefix(name: string): string {
        return name.replace(/^.*?__/, '');
    }
}
