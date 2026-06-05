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
        skip: true;
        dynamic: true;
    }
}

/**
 * Decorators used by the property palette generator to control which properties
 * appear in the UI and how their values are populated.
 */

export namespace PropertyPalette {
    /**
     * Excludes a property from the generated property palette UI.
     * Use this for internal properties that should not be user-editable.
     */
    export function skip(_target: object, _propertyKey?: string | symbol) {}

    /**
     * Marks a property whose choices are dynamically loaded from the model at runtime.
     * The argument specifies the type name to query for available values.
     *
     * Example: `@PropertyPalette.dynamic('DataType')` populates a choice dropdown
     * from all DataType instances in the model.
     */
    export function dynamic(value: any): PropertyDecorator {
        return ((constructor: Function) => {
            Reflect.defineMetadata('dynamic', value, constructor);
            const existing = (constructor as any).__customDecorators || [];
            existing.push(`dynamic:${value}`);
            (constructor as any).__customDecorators = existing;
        }) as any;
    }
}
