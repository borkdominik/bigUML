/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { bindWebviewEditorFactory, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { UmlDiagramEditorProvider, UmlDiagramEditorSettings } from './editor.provider.js';

export function editorModule(settings: UmlDiagramEditorSettings) {
    return new VscodeFeatureModule(context => {
        context.bind(UmlDiagramEditorSettings).toConstantValue(settings);

        bindWebviewEditorFactory(context.bind, {
            provider: UmlDiagramEditorProvider
        });
    });
}
