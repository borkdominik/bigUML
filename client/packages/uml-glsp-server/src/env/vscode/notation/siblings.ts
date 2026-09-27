/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { AstNode } from 'langium';

/**
 * The elements stored in the same list as this one, this one included - or just this one where its
 * container lists nothing.
 *
 * Read through `$containerProperty` rather than by naming the list: an element is owned by whichever
 * property holds it - a message by `Interaction.messages` when created inside an interaction and by the
 * diagram's relation list when drawn on the canvas - and naming either would silently report a set of
 * one for every element stored in the other.
 */
export function siblingsOf(node: AstNode): unknown[] {
    const container = node.$container as unknown as Record<string, unknown> | undefined;
    const siblings = node.$containerProperty ? container?.[node.$containerProperty] : undefined;
    return Array.isArray(siblings) ? siblings : [node];
}
