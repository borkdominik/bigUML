/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, EnableDefaultToolsAction, EnableToolsAction, hasArrayProp, IActionHandler, ICommand } from '@eclipse-glsp/client';
import { GLSPToolManager } from '@eclipse-glsp/client/lib/base/tool-manager/glsp-tool-manager';
import { inject, injectable } from 'inversify';

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
export class UmlToolManager extends GLSPToolManager {
    chnage(toolIds: string[], enabled: boolean): void {
        const tools = toolIds.map(id => this.tool(id));
        tools.forEach(tool => {
            if (tool !== undefined) {
                if (enabled) {
                    tool.enable();
                    if (!this.actives.includes(tool)) {
                        this.actives.push(tool);
                    }
                } else {
                    tool.disable();
                    if (this.actives.includes(tool)) {
                        this.actives.splice(this.actives.indexOf(tool), 1);
                    }
                }
            }
        });
    }
}

@injectable()
export class UmlToolManagerActionHandler implements IActionHandler {
    @inject(UmlToolManager)
    readonly toolManager: UmlToolManager;

    handle(action: Action): void | ICommand | Action {
        if (EnableDefaultToolsAction.is(action)) {
            this.toolManager.enableDefaultTools();
        } else if (EnableToolsAction.is(action)) {
            this.toolManager.enable(action.toolIds);
        } else if (ChangeToolsStateAction.is(action)) {
            this.toolManager.chnage(action.toolIds, action.enabled);
        }
    }
}
