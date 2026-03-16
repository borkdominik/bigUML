/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

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
