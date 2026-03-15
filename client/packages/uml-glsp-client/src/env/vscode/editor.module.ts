/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { bindWebviewEditorFactory, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { UMLDiagramEditorProvider, UMLDiagramEditorSettings } from './editor.provider.js';

export function editorModule(settings: UMLDiagramEditorSettings) {
    return new VscodeFeatureModule(context => {
        context.bind(UMLDiagramEditorSettings).toConstantValue(settings);

        bindWebviewEditorFactory(context.bind, {
            provider: UMLDiagramEditorProvider
        });
    });
}
