/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ChangeBoundsOperation, ElementAndBounds, LayoutOperation } from '@eclipse-glsp/protocol';
import {
    type Command,
    CompoundCommand,
    DiagramConfiguration,
    LayoutEngine,
    OperationHandler,
    OperationHandlerRegistry,
    ServerLayoutKind
} from '@eclipse-glsp/server';
import { inject, injectable, optional } from 'inversify';
import { type DiagramModelState } from '../model/diagram-model-state.js';

@injectable()
export class BigLayoutOperationHandler extends OperationHandler {
    override readonly operationType = LayoutOperation.KIND;

    declare modelState: DiagramModelState;

    @inject(LayoutEngine)
    @optional()
    protected layoutEngine?: LayoutEngine;

    @inject(DiagramConfiguration)
    protected diagramConfiguration: DiagramConfiguration;

    @inject(OperationHandlerRegistry)
    protected operationHandlerRegistry: OperationHandlerRegistry;

    override async createCommand(operation: LayoutOperation): Promise<Command | undefined> {
        if (this.diagramConfiguration.layoutKind !== ServerLayoutKind.MANUAL) {
            return undefined;
        }
        if (!this.layoutEngine) {
            return undefined;
        }

        // Compute layout directly on the GModelRoot
        const layoutedRoot = await this.layoutEngine.layout(operation);
        
        if (!layoutedRoot) {
            return undefined;
        }

        const newBounds: ElementAndBounds[] = [];

        const processNode = (node: any) => {
            if (node.id) {
                // If it has position and size, check if it's in the index (a semantic node)
                if (node.position && node.size) {
                    if (this.modelState.index.findPath(node.id)) {
                        newBounds.push({
                            elementId: node.id,
                            newPosition: { x: node.position.x, y: node.position.y },
                            newSize: { width: node.size.width, height: node.size.height }
                        });
                    }
                }

            }

            if (node.children) {
                for (const child of node.children) {
                    processNode(child);
                }
            }
        };

        processNode(layoutedRoot);

        const commands: Command[] = [];

        // 1. Add Bounds modification patch command by delegating to the GenericChangeBoundsOperationHandler
        if (newBounds.length > 0) {
            const changeBoundsOp = ChangeBoundsOperation.create(newBounds);
            const boundsHandler = this.operationHandlerRegistry.getOperationHandler(changeBoundsOp);
            if (boundsHandler) {
                const changeBoundsCmd = await boundsHandler.createCommand(changeBoundsOp);
                if (changeBoundsCmd) {
                    commands.push(changeBoundsCmd);
                }
            }
        }

        if (commands.length === 0) {
            return undefined;
        }

        return new CompoundCommand(commands);
    }
}
