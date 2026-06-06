/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Core language decorators that define the structure of the UML grammar.
 * These are used in def files and interpreted by the tooling parser and generators.
 */
 
export namespace Language {
    /**
     * Marks a class as the root entry point of the grammar.
     * Exactly one class in the def files must have this decorator.
     */
    export function root(_target: any, _propertyKey?: any) {}

    /**
     * Marks a property as a reference to another model element.
     * The generated Langium grammar will emit a reference rule instead of an inline value.
     */
    export function reference(_target: any, _propertyKey?: any) {}

    /**
     * Runtime type for references between model elements.
     * Used in the Langium AST at runtime (not during code generation).
     * Properties marked with `@Language.reference` in def files use this type
     * to hold a reference to another element by document URI and path.
     */
    export interface Reference<T> {
        /** the type of the referenced element */
        type: T;
        /** the document uri of the referenced element */
        __documentUri?: string;
        /** the path to the referenced element in the given document uri */
        __path?: string;
        /** the id of the referenced element */
        [ref: string]: string | T | undefined;
    }

}
