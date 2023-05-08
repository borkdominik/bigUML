/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, IActionHandler } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

import { isSetOutlineAction } from './outline.actions';
import { OutlineService } from './outline.service';

@injectable()
export class OutlineActionHandler implements IActionHandler {
    @inject(OutlineService)
    protected readonly outlineService: OutlineService;

    handle(action: Action): void | Action {
        if (isSetOutlineAction(action)) {
            this.outlineService.updateOutline(action.outlineTreeNodes);
        }
    }
}
