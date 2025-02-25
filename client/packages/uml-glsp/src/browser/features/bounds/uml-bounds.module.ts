/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { configureActionHandler, configureLayout, TYPES } from '@eclipse-glsp/client';
import { boundsModule } from '@eclipse-glsp/client/lib/features/bounds/bounds-module.js';
import { bindOrRebind, FeatureModule, SetViewportAction } from '@eclipse-glsp/protocol';
import { GraphGridActionHandler, ShowGridAction, UMLGridSnapper } from './grid-snapper.js';
import { UMLFreeFormLayouter, UMLLayouterExt } from './index.js';

export const umlBoundsModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, TYPES.Layouter).to(UMLLayouterExt).inSingletonScope();
        bindOrRebind(context, TYPES.ISnapper).to(UMLGridSnapper).inSingletonScope();

        configureLayout(context, UMLFreeFormLayouter.KIND, UMLFreeFormLayouter);

        bind(GraphGridActionHandler).toSelf().inSingletonScope();
        bind(TYPES.IDiagramStartup).toService(GraphGridActionHandler);
        configureActionHandler(context, ShowGridAction.KIND, GraphGridActionHandler);
        configureActionHandler(context, SetViewportAction.KIND, GraphGridActionHandler);
    },
    { requires: boundsModule }
);
