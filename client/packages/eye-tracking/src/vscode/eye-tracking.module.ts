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

export function eyeTrackingModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(EyeTrackingViewId).toConstantValue(viewId);
        bind(EyeTrackingProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(EyeTrackingProvider);

        // Handle the request vscode side
        // This will prevent the glsp to handle the request
        // Remember to comment out the the glsp client handler!
        // In EyeTrackingActionHandler implementation GLSP has priority over vscode

        // bind(EyeTrackingActionHandler).toSelf().inSingletonScope();
        // bind(TYPES.Disposable).toService(EyeTrackingActionHandler);
        // bind(TYPES.RootInitialization).toService(EyeTrackingActionHandler);
    });
}
