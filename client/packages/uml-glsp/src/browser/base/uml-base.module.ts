/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindOrRebind, FeatureModule, GLSPActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { UMLActionDispatcher } from './action-dispatcher.js';
import { UMLFeedbackActionDispatcher } from './feedback/feedback-action-dispatcher.js';
import { FixedLogger } from './fixed-logger.js';

export const umlBaseModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindOrRebind(context, TYPES.ILogger).to(FixedLogger).inSingletonScope();
    bindOrRebind(context, GLSPActionDispatcher).to(UMLActionDispatcher).inSingletonScope();
    bindOrRebind(context, TYPES.IFeedbackActionDispatcher).to(UMLFeedbackActionDispatcher).inSingletonScope();
});
