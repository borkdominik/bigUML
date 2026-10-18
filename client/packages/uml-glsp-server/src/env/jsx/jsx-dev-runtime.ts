/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { jsx } from './jsx-runtime.js';

export { Fragment, type JSX } from './jsx-runtime.js';

/**
 * Development variant of the JSX factory, imported by dev-mode JSX transforms (e.g. vitest).
 * The additional debug arguments (key, source, self) are ignored.
 */
export function jsxDEV(type: any, props: any): any {
    return jsx(type, props);
}
