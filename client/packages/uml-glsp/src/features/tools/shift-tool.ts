/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { Action, BaseGLSPTool, EnableToolsAction, KeyListener, KeyTool, SModelElement } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { ShiftMouseTool } from './shift-mouse-tool';

@injectable()
export class ShiftTool extends BaseGLSPTool {
    static ID = 'glsp.vertical-shift-tool';

    protected shiftKeyListener: ShiftKeyListener = new ShiftKeyListener();

    @inject(KeyTool) protected readonly keytool: KeyTool;

    get id(): string {
        return ShiftTool.ID;
    }

    enable(): void {
        this.keyTool.register(this.shiftKeyListener);
    }

    disable(): void {
        this.keyTool.deregister(this.shiftKeyListener);
    }
}

@injectable()
export class ShiftKeyListener extends KeyListener {
    override keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
        if (event.altKey) {
            return [EnableToolsAction.create([ShiftMouseTool.ID])];
        }
        return [];
    }
}
