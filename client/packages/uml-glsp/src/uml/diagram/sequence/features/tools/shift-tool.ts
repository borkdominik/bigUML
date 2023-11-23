/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, BaseGLSPTool, EnableToolsAction, KeyListener, KeyTool, SModelElement } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { SDShiftMouseTool } from './shift-mouse-tool';

// TODO: Sequence Diagram Specific
@injectable()
export class SDShiftTool extends BaseGLSPTool {
    static ID = 'glsp.vertical-shift-tool';

    protected shiftKeyListener: SDShiftKeyListener = new SDShiftKeyListener();

    @inject(KeyTool) protected readonly keytool: KeyTool;

    get id(): string {
        return SDShiftTool.ID;
    }

    enable(): void {
        this.keyTool.register(this.shiftKeyListener);
    }

    disable(): void {
        this.keyTool.deregister(this.shiftKeyListener);
    }
}

@injectable()
export class SDShiftKeyListener extends KeyListener {
    override keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
        if (event.altKey) {
            return [EnableToolsAction.create([SDShiftMouseTool.ID])];
        }
        return [];
    }
}
