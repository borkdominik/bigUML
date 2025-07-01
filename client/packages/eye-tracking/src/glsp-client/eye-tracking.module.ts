/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { 
    configureActionHandler, 
    FeatureModule, 
    SetViewportAction, 
    ViewportResult,
    ChangeBoundsOperation,
    SetBoundsAction,
    TYPES
} from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';

import { 
    StartEyeTrackingAction, 
    StopEyeTrackingAction, 
    EyeTrackingStatusAction, 
    EyeTrackingDataAction 
} from '../common/eye-tracking.action.js';

import { 
    ViewportTrackingAction, 
    ElementBoundsTrackingAction,
    MouseClickTrackingAction,
    MousePositionTrackingAction
} from '../common/interaction-tracking.action.js';
import { ViewportTrackingHandler } from './viewport-tracking.handler.js';
import { ElementBoundsTrackingHandler } from './element-bounds-tracking.handler.js';
import { MouseClickTrackingHandler } from './mouse-click-tracking.handler.js';

export const eyeTrackingModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    
    // Log the KIND values to verify they're correct
    console.log('[EyeTrackingModule] Registering handlers...');
    console.log('[EyeTrackingModule] ChangeBoundsOperation.KIND =', ChangeBoundsOperation.KIND);
    console.log('[EyeTrackingModule] SetBoundsAction.KIND =', SetBoundsAction.KIND);
    
    // Register the ViewportTrackingHandler to capture viewport changes
    bind(ViewportTrackingHandler).toSelf().inSingletonScope();
    configureActionHandler(context, SetViewportAction.KIND, ViewportTrackingHandler);
    configureActionHandler(context, ViewportResult.KIND, ViewportTrackingHandler);

    // Register the ElementBoundsTrackingHandler to capture element moves/resizes
    bind(ElementBoundsTrackingHandler).toSelf().inSingletonScope();
    configureActionHandler(context, ChangeBoundsOperation.KIND, ElementBoundsTrackingHandler);
    configureActionHandler(context, SetBoundsAction.KIND, ElementBoundsTrackingHandler);
    // Also try registering with explicit string in case KIND is different
    configureActionHandler(context, 'changeBounds', ElementBoundsTrackingHandler);
    configureActionHandler(context, 'setBounds', ElementBoundsTrackingHandler);

    // Register the MouseClickTrackingHandler to capture mouse clicks
    bind(MouseClickTrackingHandler).toSelf().inSingletonScope();
    bind(TYPES.MouseListener).toService(MouseClickTrackingHandler);

    // Allow actions to propagate to the VSCode extension
    bind(ExtensionActionKind).toConstantValue(StartEyeTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(StopEyeTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(EyeTrackingStatusAction.KIND);
    bind(ExtensionActionKind).toConstantValue(EyeTrackingDataAction.KIND);
    bind(ExtensionActionKind).toConstantValue(ViewportTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(ElementBoundsTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(MouseClickTrackingAction.KIND);
    bind(ExtensionActionKind).toConstantValue(MousePositionTrackingAction.KIND);
});
