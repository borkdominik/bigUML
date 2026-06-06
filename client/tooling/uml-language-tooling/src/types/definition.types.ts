/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export interface Declaration {
    type: 'class' | 'type';
    name?: string;
    isAbstract?: boolean;
    decorators: Decorator[];
    properties?: Array<Property>;
    extends?: string[];
    /** Reverse of `extends` — populated by the transformer. */
    extendedBy?: string[];
}

/**
 * A structured representation of a TypeScript decorator parsed from a def file.
 */
export interface Decorator {
    /** The decorator name, e.g., `"root"`, `"reference"`, `"toolPalette"`. */
    name: string;
    /** Parsed arguments. Empty array for argument-less decorators like `@root`. */
    args: DecoratorArg[];
}

/**
 * A single decorator argument value.
 */
export type DecoratorArg = string | number | boolean | Record<string, unknown>;

/**
 * Registry of known decorator names. Packages extend this via module augmentation
 * to get type-safe `Decorator.find` / `Decorator.has` calls.
 *
 * @example
 * // In a consumer package:
 * declare module '@borkdominik-biguml/uml-language-tooling' {
 *     interface DecoratorNameRegistry {
 *         myDecorator: true;
 *     }
 * }
 */

export interface DecoratorNameRegistry {
    root: true;
    reference: true;
}

/** Union of all registered decorator names. */
export type DecoratorName = keyof DecoratorNameRegistry;

export namespace Decorator {
    /** Find a decorator by registered name (type-safe). */
    export function find(decorators: Decorator[], name: DecoratorName): Decorator | undefined {
        return decorators.find(d => d.name === name);
    }

    /** Check if a decorator with the given registered name exists (type-safe). */
    export function has(decorators: Decorator[], name: DecoratorName): boolean {
        return decorators.some(d => d.name === name);
    }

    /** Get a typed argument at the given index. */
    export function getArg<T extends DecoratorArg>(decorator: Decorator, index = 0): T | undefined {
        return decorator.args[index] as T | undefined;
    }
}

export enum Multiplicity {
    ZERO_TO_N = '*',
    ONE_TO_N = '+',
    ONE_TO_ONE = '1'
}

/**
 * A property of a class or interface declaration in a def file.
 * Used by generators to produce grammar rules, serializers, and UI handlers.
 */
export interface Property {
    name: string;
    isOptional: boolean;
    decorators: Decorator[];
    types: Type[];
    multiplicity: Multiplicity;
    defaultValue?: string | number | boolean | Record<string, unknown>;
}

/**
 * Represents the type of a property value in a def file.
 *
 * - `"simple"` — Primitive: `string`, `number`, `boolean`.
 * - `"constant"` — Literal value: `'CLASS'`, `'PUBLIC'`. Stored JSON-stringified.
 * - `"complex"` — Reference to another declaration: `Node`, `ClassDiagram`.
 */
export interface Type {
    type: 'constant' | 'simple' | 'complex';
    typeName: string;
}
