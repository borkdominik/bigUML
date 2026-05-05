/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Action, BaseEditTool, EnableToolsAction, type GModelElement, KeyListener } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { SDShiftMouseTool } from './shift-mouse-tool.js';

// TODO: Sequence Diagram Specific
@injectable()
export class SDShiftTool extends BaseEditTool {
    static ID = 'glsp.vertical-shift-tool';

    protected shiftKeyListener: SDShiftKeyListener = new SDShiftKeyListener();

    get id(): string {
        return SDShiftTool.ID;
    }

    enable(): void {
        this.toDisposeOnDisable.push(this.keyTool.registerListener(this.shiftKeyListener));
    }
}

@injectable()
export class SDShiftKeyListener extends KeyListener {
    override keyDown(_element: GModelElement, event: KeyboardEvent): Action[] {
        if (event.altKey) {
            return [EnableToolsAction.create([SDShiftMouseTool.ID])];
        }
        return [];
    }
}
