/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type Action } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';

import { EnableToolsAction, GLSPScrollMouseListener, type IActionHandler, type ICommand } from '@eclipse-glsp/client';
import { SDShiftMouseTool } from '../tools/shift-mouse-tool.js';

// TODO: Sequence Diagram Specific
@injectable()
export class SDScrollMouseListener extends GLSPScrollMouseListener implements IActionHandler {
    override handle(action: Action): void | Action | ICommand {
        if (EnableToolsAction.is(action) && action.toolIds.includes(SDShiftMouseTool.ID)) {
            this.preventScrolling = true;
        } else {
            super.handle(action);
        }
    }
}
