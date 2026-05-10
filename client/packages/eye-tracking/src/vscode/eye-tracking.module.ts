/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindLifecycle, bindWebviewViewFactory, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { EyeTrackingCommandHandler } from './eye-tracking-commands.handler.js';
import { EyeTrackingProvider } from './eye-tracking.provider.js';
import { TYPES as EYE_TYPES } from './eye-tracking.types.js';
import { InteractionReplayService } from './interaction-replay.service.js';
import { InteractionTracker } from './interaction-tracker.service.js';

export function eyeTrackingModule(viewId: string) {
    return new VscodeFeatureModule(context => {
        context.bind(EYE_TYPES.InteractionTracker).to(InteractionTracker).inSingletonScope();
        context.bind('InteractionTracker').toService(EYE_TYPES.InteractionTracker);
        context.bind(EYE_TYPES.InteractionReplayService).to(InteractionReplayService).inSingletonScope();
        context.bind(EYE_TYPES.EyeTrackingCommandHandler).to(EyeTrackingCommandHandler).inSingletonScope();
        bindLifecycle(context, EYE_TYPES.EyeTrackingCommandHandler);

        bindWebviewViewFactory(context, {
            provider: EyeTrackingProvider,
            options: {
                viewType: viewId
            }
        });
    });
}
