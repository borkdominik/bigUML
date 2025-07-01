/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

// import { configureActionHandler, FeatureModule } from '@eclipse-glsp/client';
import { FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
//import { EyeTrackingActionResponse, RequestEyeTrackingAction } from '../common/eye-tracking.action.js';

import { 
    StartEyeTrackingAction, 
    StopEyeTrackingAction, 
    EyeTrackingStatusAction, 
    EyeTrackingDataAction 
} from '../common/eye-tracking.action.js';

//import { EyeTrackingHandler } from './eye-tracking.handler.js';

export const eyeTrackingModule = new FeatureModule((bind, _unbind, _isBound, _rebind) => {
    //const context = { bind, unbind, isBound, rebind };
    // Register the EyeTrackingHandler to handle the RequestEyeTrackingAction
    //bind(EyeTrackingHandler).toSelf().inSingletonScope();
    //configureActionHandler(context, RequestEyeTrackingAction.KIND, EyeTrackingHandler);

    // Allow the EyeTrackingActionResponse to propagate to the server
    bind(ExtensionActionKind).toConstantValue(StartEyeTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(StopEyeTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(EyeTrackingStatusAction.KIND);
    bind(ExtensionActionKind).toConstantValue(EyeTrackingDataAction.KIND);
});
