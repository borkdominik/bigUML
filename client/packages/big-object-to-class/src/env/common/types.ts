/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * 6a — Intermediate representation produced by the mock parser.
 * Decouples the raw input format from the inference engine.
 */
export interface ParsedInstanceData {
    instances: ParsedInstance[];
    links: ParsedLink[];
}

export interface ParsedInstance {
    name: string;
    typeName: string;
    slots: { featureName: string; value: string }[];
}

export interface ParsedLink {
    sourceName: string;
    targetName: string;
    linkName?: string;
}

/**
 * 6b — A class inferred from grouped instance data.
 */
export interface InferredClass {
    name: string;
    properties: InferredProperty[];
}

export interface InferredProperty {
    name: string;
    type: InferredType;
    isOptional: boolean;
}

export type InferredType = 'String' | 'Integer' | 'Real' | 'Boolean' | { kind: 'Enumeration'; name: string };

/**
 * 6c — An association inferred from links between instances.
 */

export interface InferredAssociation {
    name: string | undefined;
    sourceTypeName: string;
    targetTypeName: string;
    sourceMultiplicity: string;
    targetMultiplicity: string;
    relationType?: 'ASSOCIATION' | 'GENERALIZATION' | 'INSTANCE_LINK';
    message?: string;
}

/**
 * 6e — Conflict detected during inference.
 */
export interface ConflictReport {
    kind: 'type_conflict' | 'name_ambiguity';
    message: string;
    conflictingNames?: string[];
}

/**
 * The complete result of the transformation engine.
 */
export interface TransformationResult {
    parsed: ParsedInstanceData;
    classes: InferredClass[];
    associations: InferredAssociation[];
    conflicts: ConflictReport[];
}
