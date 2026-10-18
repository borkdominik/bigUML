/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Rng } from './rng.js';

/**
 * Coarse classification of a property's type, derived from the UML metamodel
 * (`Property.propertyType`) by the generation core. Strategies branch on this
 * instead of inspecting the live AST, which keeps them pure and testable.
 */
export type PropertyTypeKind = 'string' | 'integer' | 'boolean' | 'real' | 'enumeration' | 'reference' | 'unknown';

/**
 * A plain-data view of a single property to generate a value for. Deliberately
 * decoupled from the Langium AST so strategies can be tested without GLSP.
 */
export interface PropertyDescriptor {
    /** Property name (used by some strategies, e.g. random string seeding, patterns). */
    name: string;
    /** Coarse type classification used to choose how to generate a value. */
    typeKind: PropertyTypeKind;
    /** Resolved type name (e.g. 'String', 'Person', 'Role'); informational. */
    typeName?: string;
    /** Literal names for `enumeration` properties. */
    enumLiterals?: readonly string[];
    /** UML `isReadOnly` — read-only properties are skipped by the generation core. */
    isReadOnly?: boolean;
    /** UML `isUnique` — uniqueness is enforced best-effort by the generation core. */
    isUnique?: boolean;
}

/** Per-value generation context passed to a strategy. */
export interface ValueContext {
    /** Seeded RNG; strategies must use this rather than `Math.random` for reproducibility. */
    rng: Rng;
    /** 1-based index of the instance currently being generated (e.g. for `{n}` patterns). */
    index: number;
    /** `__id` of the classifier being instantiated; lets strategies use per-classifier config. */
    classifierId?: string;
}

/**
 * A value-generation strategy. Implementations are pure functions of
 * `(property, ctx)` and return the string to store in a `LiteralSpecification`
 * (slot values are always strings in the bigUML metamodel), or `undefined` to
 * skip the slot (e.g. for reference-typed properties handled by link generation).
 */
export interface ValueStrategy {
    /** Stable identifier of the strategy, e.g. 'random' | 'pattern'. */
    readonly kind: string;
    value(property: PropertyDescriptor, ctx: ValueContext): string | undefined;
}
