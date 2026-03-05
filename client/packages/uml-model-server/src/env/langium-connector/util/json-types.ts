/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import * as jsonPatch from 'fast-json-patch';
import type { AstNode, Reference } from 'langium';
import type { IntermediatePatchReference } from '../patch/patch-manager.util.js';

export { jsonPatch };

export type SerializeAstNode<T extends AstNode> = T extends unknown ? Omit<{ [K in keyof T]: SerializeValue<T[K]> }, '$container'> : never;

export interface SerializedRecordNode extends SerializeAstNode<AstNode> {
    [key: string]: unknown;
}

type SerializeValue<V> =
    V extends Reference<any>
        ? IntermediatePatchReference
        : V extends AstNode
          ? SerializeAstNode<V>
          : V extends readonly (infer U)[]
            ? U extends AstNode
                ? SerializeAstNode<U>[]
                : V
            : V;
