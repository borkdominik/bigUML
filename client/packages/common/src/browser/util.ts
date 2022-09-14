/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
/**
 * The built-in 'object' & 'Object' types are currently hard to use
 * an should be avoided. It's recommended to use Record instead to describe the
 * type meaning of "any object";
 */
export type AnyObject = Record<PropertyKey, unknown>;

export namespace AnyObject {
    /**
     * Type guard to check wether a given object is of type {@link AnyObject}.
     * @param object The object to check.
     * @returns The given object as {@link AnyObject} or `false`.
     */
    export function is(object: unknown): object is AnyObject {
        // eslint-disable-next-line no-null/no-null
        return object !== null && typeof object === "object";
    }
}
