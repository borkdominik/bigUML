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
export class FixedFeedbackActionDispatcher extends FeedbackActionDispatcher {
    constructor() {
        super();
        // overwrite private member "getMessage" 🙀
        (this as any).dispatch = this.fixedDispatch;
    }

    private fixedDispatch(actions: Action[], feedbackEmitter: IFeedbackEmitter): void {
        this.actionDispatcher()
            .then(dispatcher => dispatcher.dispatchAll(actions))
            .then(() => this.logger.log(this, 'Dispatched feedback actions for', feedbackEmitter))
            .catch(reason => this.logger.error(this, 'Failed to dispatch feedback actions', reason));
    }
}
