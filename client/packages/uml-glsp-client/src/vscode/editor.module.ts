/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ContainerModule } from 'inversify';
import { UMLDiagramEditorProvider, UMLDiagramEditorSettings } from './editor.provider.js';

export function editorModule(settings: UMLDiagramEditorSettings) {
    return new ContainerModule(bind => {
        bind(UMLDiagramEditorSettings).toConstantValue(settings);
        bind(UMLDiagramEditorProvider).toSelf().inSingletonScope();
        bind(TYPES.EditorProvider).toService(UMLDiagramEditorProvider);
        bind(TYPES.RootInitialization).toService(UMLDiagramEditorProvider);
        bind(TYPES.ServerManagerStateListener).toService(UMLDiagramEditorProvider);
    });
}
