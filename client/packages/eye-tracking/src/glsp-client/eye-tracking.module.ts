/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { configureActionHandler, FeatureModule, SetViewportAction, ViewportResult } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';

import { 
    StartEyeTrackingAction, 
    StopEyeTrackingAction, 
    EyeTrackingStatusAction, 
    EyeTrackingDataAction 
} from '../common/eye-tracking.action.js';

import { ViewportTrackingAction } from '../common/interaction-tracking.action.js';
import { ViewportTrackingHandler } from './viewport-tracking.handler.js';

export const eyeTrackingModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    
    // Register the ViewportTrackingHandler to capture viewport changes
    bind(ViewportTrackingHandler).toSelf().inSingletonScope();
    configureActionHandler(context, SetViewportAction.KIND, ViewportTrackingHandler);
    configureActionHandler(context, ViewportResult.KIND, ViewportTrackingHandler);

    // Allow actions to propagate to the VSCode extension
    bind(ExtensionActionKind).toConstantValue(StartEyeTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(StopEyeTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(EyeTrackingStatusAction.KIND);
    bind(ExtensionActionKind).toConstantValue(EyeTrackingDataAction.KIND);
    bind(ExtensionActionKind).toConstantValue(ViewportTrackingAction.KIND);
});
