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
     * Marks a class as a value object: a piece of data nested inside an element, such as its bounds.
     *
     * A value is not an element of the diagram. It carries no `__id`, cannot be referenced, is neither
     * a node, an edge nor unbounded, and a property holding one is neither containment nor something
     * the palettes offer - it is written and read together with the element that holds it.
     */
    export function value(_target: any, _propertyKey?: any) {}

    /**
     * Marks a string property as free-form text.
     *
     * Every string property can hold any text - it is stored as a JSON string. What this
     * says is that the value is notation rather than a name: edited in place on the canvas,
     * the brackets or braces it is drawn in (`[guard]`, `{ordered}`) are taken off again
     * before it is stored.
     */
    export function text(_target: any, _propertyKey?: any) {}

    /**
     * Marks a string property as a UML multiplicity - `1`, `*`, `0..1`, `1..*`.
     *
     * Parsed as free text, the way `@Language.text` is, and held to what a multiplicity is wherever it
     * is written: the generated validation reports one that is not, the canvas refuses to store it, and
     * the property palette drops what cannot be part of one while it is typed. The rules are in
     * `@borkdominik-biguml/uml-language-tooling/values`, and this is the only place a property is said
     * to hold one.
     */
    export function multiplicity(_target: any, _propertyKey?: any) {}

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
