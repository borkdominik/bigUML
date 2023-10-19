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
import { Action } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';

import { EnableToolsAction, GLSPScrollMouseListener, IActionHandler, ICommand } from '@eclipse-glsp/client';
import { ShiftMouseTool } from '../tools/shift-mouse-tool';

@injectable()
export class UMLScrollMouseListener extends GLSPScrollMouseListener implements IActionHandler {
    override handle(action: Action): void | Action | ICommand {
        if (action.kind === EnableToolsAction.KIND) {
            if ((action as EnableToolsAction).toolIds.includes(ShiftMouseTool.ID)) {
                this.preventScrolling = true;
            } else {
                super.handle(action);
            }
        }
    }
}
