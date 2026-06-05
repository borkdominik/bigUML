/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Declaration } from './definition.types.js';

/**
 * Context passed to each generator's `generate` function.
 */
export interface GeneratorContext {
    /** The output directory for generated files. */
    outputPath: string;
    /** The enriched declarations parsed from the def files. */
    declarations: Declaration[];
    /** Absolute path to the entry def file. */
    definitionPath: string;
}

export interface GeneratorResult {
    files: { path: string; content: string }[];
    additionalIndexPaths?: string[];
}
