/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, FeedbackActionDispatcher, IFeedbackEmitter } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class UMLFeedbackActionDispatcher extends FeedbackActionDispatcher {
    constructor() {
        super();
    }

    protected override async dispatchFeedback(actions: Action[], feedbackEmitter: IFeedbackEmitter): Promise<void> {
        try {
            const actionDispatcher = await this.actionDispatcher();
            await actionDispatcher.dispatchAll(actions);
            this.logger.log(this, 'Dispatched feedback actions for', feedbackEmitter);
        } catch (reason) {
            this.logger.error(this, 'Failed to dispatch feedback actions', reason);
        }
    }
}
