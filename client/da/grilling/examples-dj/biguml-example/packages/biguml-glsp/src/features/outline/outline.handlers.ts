/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

/**
 * TODO: Workaround until the webview (property palette) can handle the actions directly
 */
@injectable()
export class OutlineActionHandler implements IActionHandler {
    handle(action: Action): void | Action {
        // nothing to do
    }
}
