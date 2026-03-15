/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindOrRebind, configureActionHandler, configureLayout, FeatureModule, GLSPHiddenBoundsUpdater, TYPES } from '@eclipse-glsp/client';
import { boundsModule } from '@eclipse-glsp/client/lib/features/bounds/bounds-module.js';
import { SetViewportAction } from '@eclipse-glsp/protocol';
import { GraphGridActionHandler, ShowGridAction, UmlGridSnapper } from './grid-snapper.js';
import { UmlFreeFormLayouter, UmlLayouterExt } from './index.js';
import { UmlHiddenBoundsUpdater } from './uml-hidden-bounds-updater.js';

export const umlBoundsModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, TYPES.Layouter).to(UmlLayouterExt).inSingletonScope();
        bindOrRebind(context, TYPES.ISnapper).to(UmlGridSnapper).inSingletonScope();

        configureLayout(context, UmlFreeFormLayouter.KIND, UmlFreeFormLayouter);

        bind(GraphGridActionHandler).toSelf().inSingletonScope();
        bind(TYPES.IDiagramStartup).toService(GraphGridActionHandler);
        configureActionHandler(context, ShowGridAction.KIND, GraphGridActionHandler);
        configureActionHandler(context, SetViewportAction.KIND, GraphGridActionHandler);
        rebind(GLSPHiddenBoundsUpdater).to(UmlHiddenBoundsUpdater).inSingletonScope();
    },
    { requires: boundsModule }
);
