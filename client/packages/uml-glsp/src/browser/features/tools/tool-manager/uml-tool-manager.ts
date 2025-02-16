/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, hasArrayProp, type ICommand, ToolManager, ToolManagerActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export interface ChangeToolsStateAction extends Action {
    kind: typeof ChangeToolsStateAction.KIND;
    toolIds: string[];
    enabled: boolean;
}

export namespace ChangeToolsStateAction {
    export const KIND = 'changeToolsState';

    export function is(object: any): object is ChangeToolsStateAction {
        return Action.hasKind(object, KIND) && hasArrayProp(object, 'toolIds');
    }

    export function create(toolIds: string[], enabled: boolean): ChangeToolsStateAction {
        return { kind: KIND, toolIds, enabled };
    }
}

@injectable()
export class UMLToolManager extends ToolManager {
    change(toolIds: string[], enabled: boolean): void {
        const tools = toolIds.map(id => this.tool(id));
        tools.forEach(tool => {
            if (tool !== undefined) {
                if (enabled) {
                    if (!this.actives.includes(tool)) {
                        tool.enable();
                        this.actives.push(tool);
                    }
                } else {
                    if (this.actives.includes(tool)) {
                        tool.disable();
                        this.actives.splice(this.actives.indexOf(tool), 1);
                    }
                }
            }
        });
    }
}

@injectable()
export class UMLToolManagerActionHandler extends ToolManagerActionHandler {
    declare toolManager: UMLToolManager;

    override handle(action: Action): void | ICommand | Action {
        if (ChangeToolsStateAction.is(action)) {
            this.toolManager.change(action.toolIds, action.enabled);
        } else {
            super.handle(action);
        }
    }
}
