/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Automatic JSX runtime for sprotty views. Files select it with
 * `/** @jsxImportSource @borkdominik-biguml/uml-glsp-client/jsx *\/` and render SVG through sprotty's `svg` factory.
 *
 * Unlike the classic `/** @jsx svg *\/` pragma, the file does not have to import `svg` itself, which organize
 * imports would remove as unused.
 */
import { type FunctionComponent, type JsxVNodeChild, type VNode, type VNodeData } from 'snabbdom';
// eslint-disable-next-line no-restricted-imports
import { svg } from 'sprotty';

/**
 * Called by the automatic JSX transform. Passes the arguments on the way the classic transform did:
 * the attributes (including `key`) and the children; nested child arrays are flattened by snabbdom.
 */
export function jsx(type: FunctionComponent | string, props: Record<string, unknown>, key?: string | number): VNode {
    const { children, ...attrs } = props;
    if (key !== undefined) {
        attrs['key'] = key;
    }
    return svg(type, attrs as VNodeData, ...(children === undefined ? [] : [children as JsxVNodeChild]));
}

/** Used for elements with multiple static children; the children are an array, which `jsx` handles as well. */
export const jsxs = jsx;

export namespace JSX {
    export type Element = VNode;

    export interface IntrinsicElements {
        [elemName: string]: VNodeData;
    }

    export interface IntrinsicAttributes {
        key?: string | number;
    }
}
