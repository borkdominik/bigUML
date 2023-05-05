/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureActionHandler, TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { EnableEditorPanelAction } from './editor-panel.actions';
import { EditorPanel } from './editor-panel.extension';

const editorPanelModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    const context = { bind, _unbind, isBound, rebind };

    bind(EditorPanel).toSelf().inSingletonScope();
    bind(TYPES.IUIExtension).toService(EditorPanel);

    configureActionHandler(context, EnableEditorPanelAction.KIND, EditorPanel);
});

export default editorPanelModule;
