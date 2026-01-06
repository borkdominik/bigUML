/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ContainerModule } from 'inversify';
import { EyeTrackingProvider, EyeTrackingViewId } from './eye-tracking.provider.js';
import { InteractionTracker } from './interaction-tracker.service.js';
import { InteractionReplayService } from './interaction-replay.service.js';
import { EyeTrackingCommandHandler } from './eye-tracking-commands.handler.js';
import { TYPES as EYE_TYPES } from './eye-tracking.types.js';

export function eyeTrackingModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(EyeTrackingViewId).toConstantValue(viewId);
        bind(EYE_TYPES.InteractionTracker).to(InteractionTracker).inSingletonScope();
        // Also bind as string so other modules can inject it optionally
        bind('InteractionTracker').toService(EYE_TYPES.InteractionTracker);
        bind(EYE_TYPES.InteractionReplayService).to(InteractionReplayService).inSingletonScope();
        bind(EYE_TYPES.EyeTrackingCommandHandler).to(EyeTrackingCommandHandler).inSingletonScope();
        bind(EyeTrackingProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(EyeTrackingProvider);
        bind(TYPES.RootInitialization).toService(EYE_TYPES.EyeTrackingCommandHandler);
        bind(TYPES.Disposable).toService(EYE_TYPES.EyeTrackingCommandHandler);

    });
}
