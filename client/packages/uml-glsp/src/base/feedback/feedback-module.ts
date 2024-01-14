/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    bindOrRebind, TYPES
} from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { UmlFeedbackActionDispatcher } from './feedback-action-dispatcher';

export const umlFeedbackModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindOrRebind(context, TYPES.IFeedbackActionDispatcher).to(UmlFeedbackActionDispatcher).inSingletonScope();
});
