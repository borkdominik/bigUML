/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    bindOrRebind,
    FeatureModule,
    GLSPActionDispatcher,
    HiddenModelViewer,
    TYPES,
    type IViewArgs,
    type IVNodePostprocessor,
    type ModelRenderer,
    type RenderingTargetKind,
    type ViewRegistry
} from '@eclipse-glsp/client';
import { UmlActionDispatcher } from './action-dispatcher.js';
import { UmlFeedbackActionDispatcher } from './feedback/feedback-action-dispatcher.js';
import { FixedLogger } from './fixed-logger.js';
import { UmlHiddenModelViewer, UmlModelRenderer } from './model-viewer.js';

export const umlBaseModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindOrRebind(context, TYPES.ILogger).to(FixedLogger).inSingletonScope();
    bindOrRebind(context, GLSPActionDispatcher).to(UmlActionDispatcher).inSingletonScope();
    bindOrRebind(context, TYPES.IFeedbackActionDispatcher).to(UmlFeedbackActionDispatcher).inSingletonScope();
    rebind(HiddenModelViewer).to(UmlHiddenModelViewer).inSingletonScope();
    rebind(TYPES.ModelRendererFactory).toFactory<ModelRenderer, any>(ctx => {
        return (targetKind: RenderingTargetKind, processors: IVNodePostprocessor[], args: IViewArgs = {}) => {
            const viewRegistry = ctx.container.get<ViewRegistry>(TYPES.ViewRegistry);
            return new UmlModelRenderer(viewRegistry, targetKind, processors, args);
        };
    });
});
