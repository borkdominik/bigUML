/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Who is editing a document. Every document may be open in the text editor and in a diagram at the
 * same time, and each keeps a version of its own so that the newer one wins.
 */
export type ClientId = string;

/** The text editor, which reaches the server through the language server protocol. */
export const TEXT_EDITOR_CLIENT: ClientId = 'text';

/** The diagram editor, which reaches the server through the GLSP server in the same process. */
export const DIAGRAM_CLIENT: ClientId = 'glsp';

/** A request that names no client comes from the text editor. */
export function clientOrTextEditor(client?: ClientId): ClientId {
    return client ?? TEXT_EDITOR_CLIENT;
}
