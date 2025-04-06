/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { Action, IActionHandler, ICommand } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { RevisionManagementResponse, RequestRevisionManagementAction } from '../common/revision-management.action.js';

@injectable()
export class RevisionManagementHandler implements IActionHandler {
    private count = 0;

    handle(action: Action): ICommand | Action | void {
        if (RequestRevisionManagementAction.is(action)) {
            this.count += action.increase;
            console.log(`Hello World from the GLSP Client: ${this.count}`);
            return RevisionManagementResponse.create({
                count: this.count
            });
        }
    }
}
