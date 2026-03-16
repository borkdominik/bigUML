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

/**
 * A type that represents a serializable version of an AST node, where all references are replaced with intermediate patch references.
 * This is used for communication between the server and client, as AST nodes cannot be directly serialized due to their complex structure and references.
 *
 * Moreover, all runtime specific properties (like $container) are omitted to ensure that the serialized version only contains data that can be safely transmitted and reconstructed on the other side.
 */
export type SerializeAstNode<T extends AstNode> = T extends unknown
    ? Omit<{ [K in keyof T]: SerializeValue<T[K]> }, Exclude<Extract<keyof T, `$${string}`>, '$type'>>
    : never;

/**
 * A type similar to {@link SerializeAstNode}, but with `$type` renamed to `__type`.
 * This is used by the serialized AST nodes on disk.
 */
export type SourceAstNode<T extends AstNode> = T extends unknown
    ? Omit<{ [K in keyof T]: SourceValue<T[K]> }, Extract<keyof T, `$${string}`>> & { __type: T['$type'] }
    : never;

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

type SourceValue<V> =
    V extends Reference<any>
        ? IntermediatePatchReference
        : V extends AstNode
          ? SourceAstNode<V>
          : V extends readonly (infer U)[]
            ? U extends AstNode
                ? SourceAstNode<U>[]
                : V
            : V;
