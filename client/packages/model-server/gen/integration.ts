/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import type { UmlDiagramServices, UmlDiagramSharedServices } from './langium/uml-diagram-module.js';

/**
 * Language services required in GLSP.
 */
export const UmlDiagramLSPServices = Symbol('UmlDiagramLSPServices');
export interface UmlDiagramLSPServices {
    /** Language services shared across all languages. */
    shared: UmlDiagramSharedServices;
    /** UmlDiagram language-specific services. */
    language: UmlDiagramServices;
}
