/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';

export const UMLLangugageEnvironment = {
    supportedTypes: [
        UMLDiagramType.ACTIVITY,
        UMLDiagramType.CLASS,
        UMLDiagramType.COMMUNICATION,
        UMLDiagramType.DEPLOYMENT,
        UMLDiagramType.INFORMATION_FLOW,
        UMLDiagramType.PACKAGE,
        UMLDiagramType.STATE_MACHINE,
        UMLDiagramType.USE_CASE
    ]
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
    outline: {
        viewId: 'bigUML.panel.outline'
    },
    minimap: {
        viewId: 'bigUML.panel.minimap'
    },
    helloWorld: {
        viewId: 'bigUML.panel.hello-world'
    },
    revisionManagement: {
        viewId: 'bigUML.panel.revision-management'
    },
    advancedSearch: {
        viewId: 'bigUML.panel.advancedsearch'
    }
} as const;
