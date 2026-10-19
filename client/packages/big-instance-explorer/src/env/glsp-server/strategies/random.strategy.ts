/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Rng } from './rng.js';
import { type PropertyDescriptor, type ValueContext, type ValueStrategy } from './strategy.js';

const TOKEN_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const TOKEN_LENGTH = 4;
const INTEGER_MIN = 0;
const INTEGER_MAX = 100;
const REAL_MIN = 0;
const REAL_MAX = 1000;
const REAL_DECIMALS = 2;

function randomToken(rng: Rng): string {
    let token = '';
    for (let i = 0; i < TOKEN_LENGTH; i++) {
        token += TOKEN_ALPHABET[rng.int(0, TOKEN_ALPHABET.length - 1)];
    }
    return token;
}

/**
 * Type-driven "dummy value" strategy (topic feature 4b). Produces structurally
 * valid but semantically meaningless values from a property's type, e.g.
 * `name = "username_3_xk7a"`, `age = "42"`, `isActive = "true"`.
 *
 * Returns `undefined` for reference/unknown types: those are not stored as slot
 * literals — references become `InstanceLink`s, created by link generation.
 */
export class RandomStrategy implements ValueStrategy {
    readonly kind = 'random';

    value(property: PropertyDescriptor, ctx: ValueContext): string | undefined {
        switch (property.typeKind) {
            // Untyped properties are treated as plain attributes so their slot is still
            // filled (models often omit primitive types); only true references are skipped.
            case 'string':
            case 'unknown':
                return `${property.name}_${ctx.index}_${randomToken(ctx.rng)}`;
            case 'integer':
                return String(ctx.rng.int(INTEGER_MIN, INTEGER_MAX));
            case 'boolean':
                return String(ctx.rng.bool());
            case 'real':
                return String(ctx.rng.float(REAL_MIN, REAL_MAX, REAL_DECIMALS));
            case 'enumeration':
                return property.enumLiterals && property.enumLiterals.length > 0 ? ctx.rng.pick(property.enumLiterals) : undefined;
            case 'reference':
            default:
                return undefined;
        }
    }
}
