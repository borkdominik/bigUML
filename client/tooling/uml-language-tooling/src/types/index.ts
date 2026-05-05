/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
export * from './declaration.js';
export * from './decorators.js';
export * from './langium-types.js';
export * from './multiplicity.js';
export * from './path.js';
export * from './property.js';
export * from './reference.js';

export interface ABSTRACT_ELEMENT {}
export interface ROOT_ELEMENT {}

export interface UmlToolingContributionResult {
    files: { path: string; content: string }[];
    additionalIndexPaths?: string[];
}
