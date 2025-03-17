/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UMLDiagramTypeUtil, UMLLanguageEnvironment } from '@borkdominik-biguml/uml-protocol';

export const UMLLangugageEnvironment: UMLLanguageEnvironment = {
    supportedTypes: UMLDiagramTypeUtil.supported
};

export const VSCodeSettings = {
    name: 'bigUML',
    diagramType: 'umldiagram',
    commands: {
        prefix: 'bigUML'
    },
    editor: {
        extension: 'uml',
        viewType: 'bigUML.diagramView'
    },
    propertyPalette: {
        viewId: 'bigUML.panel.property-palette'
    },
    textInputPalette: {
        viewId: 'bigUML.panel.text-input-palette'
    },
    outline: {
        viewId: 'bigUML.panel.outline'
    },
    minimap: {
        viewId: 'bigUML.panel.minimap'
    },
} as const;
