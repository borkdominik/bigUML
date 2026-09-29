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
import { changeBoundsToolModule } from '@eclipse-glsp/client/lib/features/tools/change-bounds/change-bounds-tool-module.js';
import { ChangeBoundsTool } from '@eclipse-glsp/client/lib/features/tools/change-bounds/change-bounds-tool.js';
import { SetViewportAction } from '@eclipse-glsp/protocol';
import { GraphGridActionHandler, ShowGridAction, UmlGridSnapper } from './grid-snapper.js';
import { UmlCenteredVBoxLayouter, UmlFreeFormLayouter, UmlLayouterExt } from './index.js';
import { UmlChangeBoundsTool } from './uml-change-bounds-tool.js';
import { UmlHiddenBoundsUpdater } from './uml-hidden-bounds-updater.js';

export const umlBoundsModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, TYPES.Layouter).to(UmlLayouterExt).inSingletonScope();
        bindOrRebind(context, TYPES.ISnapper).to(UmlGridSnapper).inSingletonScope();

        configureLayout(context, UmlFreeFormLayouter.KIND, UmlFreeFormLayouter);
        configureLayout(context, UmlCenteredVBoxLayouter.KIND, UmlCenteredVBoxLayouter);

        bind(GraphGridActionHandler).toSelf().inSingletonScope();
        bind(TYPES.IDiagramStartup).toService(GraphGridActionHandler);
        configureActionHandler(context, ShowGridAction.KIND, GraphGridActionHandler);
        configureActionHandler(context, SetViewportAction.KIND, GraphGridActionHandler);
        rebind(GLSPHiddenBoundsUpdater).to(UmlHiddenBoundsUpdater).inSingletonScope();
        // Resize handles for the selected element only, never for an ancestor of it (see `UmlChangeBoundsTool`).
        // Bound as itself as well, so the tool registry and anything asking for `ChangeBoundsTool` get this one.
        bind(UmlChangeBoundsTool).toSelf().inSingletonScope();
        rebind(ChangeBoundsTool).toService(UmlChangeBoundsTool);
    },
    { requires: [boundsModule, changeBoundsToolModule] }
);
