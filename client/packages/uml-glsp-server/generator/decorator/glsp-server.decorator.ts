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
        owned: true;
        floating: true;
        defaultSize: true;
        opensWith: true;
        shape: true;
        defaults: true;
        alias: true;
        toolPalette: true;
    }
}

/**
 * Decorators used by the GLSP server generator to control diagram element behavior,
 * tool palette registration, and AST type mapping.
 *
 * Everything the GLSP server needs to know about one element type is declared here, on the
 * element, and rendered into `gen/vscode/element-metadata.ts`. The generic handlers, the diagram
 * configuration and the gmodel factory read that metadata rather than keeping lists of their own.
 */
export namespace Glsp {
    /**
     * Marks an element as having no bounds of its own (no `bounds` property is written for it).
     * Elements with this decorator are rendered without explicit width/height and are placed by
     * whatever owns them - a pin by its action, a property by its class. Implies {@link owned}.
     */
    export function noBounds(_target: any, _propertyKey?: any) {}

    /**
     * Marks an element UML only lets exist inside an owner, even though it stores bounds of its own -
     * an operation is a row of the classifier that declares it. Such an element is never created on the
     * canvas by itself and is neither moved nor resized on its own.
     */
    export function owned(_target: any, _propertyKey?: any) {}

    /**
     * Marks an element that is never written inside another element, wherever it is dropped - a note
     * or a free text label, which UML attaches to what they comment on with a line rather than by
     * containment.
     */
    export function floating(_target: any, _propertyKey?: any) {}

    /**
     * The size a newly created node of this type opens at. Nodes without one open at the generic
     * default (see `DEFAULT_NODE_SIZE` in the generated metadata).
     */
    export function defaultSize(_size: { width: number; height: number }): ClassDecorator {
        return (() => {}) as ClassDecorator;
    }

    /**
     * Children a node of this type is created with, written into the given containment property by
     * the same patch that creates the node - a swimlane opens with two lanes.
     */
    export function opensWith(_options: { property: string; count: number }): ClassDecorator {
        return (() => {}) as ClassDecorator;
    }

    /**
     * Options for the client-side shape type hint of a node. What is left out defaults to what the
     * element's other markers imply: an {@link owned} element is neither repositionable nor resizable,
     * everything else is.
     */
    export interface ShapeOptions {
        repositionable?: boolean;
        resizable?: boolean;
        deletable?: boolean;
    }

    /**
     * Overrides the shape type hint the client is given for this node - an actor drawn as a stick
     * figure has nothing a resize handle could take hold of.
     */
    export function shape(_options: ShapeOptions): ClassDecorator {
        return (() => {}) as ClassDecorator;
    }

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
