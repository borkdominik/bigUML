/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { ToolPaletteItemProvider } from '@eclipse-glsp/server';
import type { DiagramLanguageMetadata } from './diagram-language-metadata.js';

/**
 * The services that serve one diagram of the language, bound once per diagram of the generated
 * `DIAGRAM_REGISTRY`. Whatever has to pick the service for the diagram currently loaded looks it up
 * here by `diagramType` rather than naming every diagram there is.
 */
export const DiagramServices = Symbol('DiagramServices');

export interface DiagramServices {
    /** The literal a model stores in `diagram.diagramType` - `CLASS`, `STATE_MACHINE`, ... */
    diagramType: string;
    languageMetadata: DiagramLanguageMetadata;
    toolPaletteItemProvider: ToolPaletteItemProvider;
}

export function findDiagramServices(services: readonly DiagramServices[], diagramType: string | undefined): DiagramServices | undefined {
    return services.find(candidate => candidate.diagramType === diagramType);
}
