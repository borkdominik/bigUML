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
        viewId: 'bigUML.panel.property-palette'
    },
    outline: {
        viewId: 'bigUML.panel.outline'
    },
    minimap: {
        viewId: 'bigUML.panel.minimap'
    },
    revisionManagement: {
        viewId: 'bigUML.panel.revision-management'
    },
    advancedSearch: {
        viewId: 'bigUML.panel.advancedsearch'
    }
} as const;
