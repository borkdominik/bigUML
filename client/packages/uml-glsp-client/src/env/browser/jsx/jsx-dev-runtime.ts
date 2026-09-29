/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { jsx } from './jsx-runtime.js';

export { type JSX } from './jsx-runtime.js';

/**
 * Development variant of the JSX factory, imported by dev-mode JSX transforms (e.g. vitest).
 * The additional debug arguments (isStaticChildren, source, self) are ignored.
 */
export function jsxDEV(type: Parameters<typeof jsx>[0], props: Parameters<typeof jsx>[1], key?: string | number): ReturnType<typeof jsx> {
    return jsx(type, props, key);
}
