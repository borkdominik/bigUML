/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import 'reflect-metadata';

declare module '@borkdominik-biguml/uml-language-tooling' {
    interface DecoratorNameRegistry {
        noBounds: true;
        defaults: true;
        alias: true;
        toolPalette: true;
    }
}

/**
 * Decorators used by the GLSP server generator to control diagram element behavior,
 * tool palette registration, and AST type mapping.
 */
export namespace Glsp {
    /**
     * Marks an element as having no bounds (no size/position metadata).
     * Elements with this decorator are rendered without explicit width/height.
     */
    export function noBounds(_target: any, _propertyKey?: any) {}

    /**
     * Enables automatic default value generation for all properties of a class.
     * Without this, only properties with explicit default values are included.
     */
    export function defaults(_target: any, _propertyKey?: any) {}

    /**
     * Aliases a class to a different AST type name in the generated Langium grammar.
     * For example, `@Glsp.alias('Association')` on `Aggregation` means
     * the grammar treats `Aggregation` as an `Association` variant.
     */
    export function alias(value: any): ClassDecorator {
        return (constructor: Function) => {
            Reflect.defineMetadata('alias', value, constructor);
            const existing = (constructor as any).__customDecorators || [];
            existing.push(`alias:${value}`);
            (constructor as any).__customDecorators = existing;
        };
    }

    /**
     * Options for configuring a tool palette entry.
     */
    export interface ToolPaletteOptions {
        /** Optional custom ID. Defaults to the kebab-case class name. */
        id?: string;
        /** The palette section this item belongs to (e.g., `"Container"`, `"Relations"`). */
        section: string;
        /** The display label shown in the palette. */
        label: string;
        /** The CSS icon class for the palette entry. */
        icon: string;
    }

    /**
     * Registers a class as a creatable element in the diagram tool palette.
     * Requires section, label, and icon to define its appearance.
     */
    export function toolPalette(_options: ToolPaletteOptions): ClassDecorator {
        return (() => {}) as ClassDecorator;
    }
}
