/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export const VSCodeSettings = {
    name: 'bigUML',
    diagramType: 'uml-diagram',
    commands: {
        prefix: 'bigUML'
    },
    editor: {
        extension: 'uml',
        viewType: 'bigUML.diagramView'
    },
    propertyPalette: {
        viewType: 'bigUML.panel.property-palette'
    },
    outline: {
        viewType: 'bigUML.panel.outline'
    },
    minimap: {
        viewType: 'bigUML.panel.minimap'
    },
    revisionManagement: {
        viewType: 'bigUML.panel.revision-management'
    },
    codeGeneration: {
        viewType: 'bigUML.panel.code-generation'
    },
    advancedSearch: {
        viewType: 'bigUML.panel.advancedsearch'
    }
} as const;
