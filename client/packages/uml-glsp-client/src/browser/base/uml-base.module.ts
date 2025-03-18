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
import { UMLActionDispatcher } from './action-dispatcher.js';
import { UMLFeedbackActionDispatcher } from './feedback/feedback-action-dispatcher.js';
import { FixedLogger } from './fixed-logger.js';
import { UMLHiddenModelViewer, UMLModelRenderer } from './model-viewer.js';

export const umlBaseModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindOrRebind(context, TYPES.ILogger).to(FixedLogger).inSingletonScope();
    bindOrRebind(context, GLSPActionDispatcher).to(UMLActionDispatcher).inSingletonScope();
    bindOrRebind(context, TYPES.IFeedbackActionDispatcher).to(UMLFeedbackActionDispatcher).inSingletonScope();
    rebind(HiddenModelViewer).to(UMLHiddenModelViewer).inSingletonScope();
    rebind(TYPES.ModelRendererFactory).toFactory<ModelRenderer, any>(ctx => {
        return (targetKind: RenderingTargetKind, processors: IVNodePostprocessor[], args: IViewArgs = {}) => {
            const viewRegistry = ctx.container.get<ViewRegistry>(TYPES.ViewRegistry);
            return new UMLModelRenderer(viewRegistry, targetKind, processors, args);
        };
    });
});
