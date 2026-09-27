/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { getDefaultSize } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import type { Dimension } from '@eclipse-glsp/protocol';

/** A size as it may come back from the index: stored `bounds` can carry no usable dimensions. */
export type StoredSize = Partial<Dimension> | undefined;

/**
 * Whether a stored size can be drawn at. Stored `bounds` can carry no usable dimensions - a zero
 * width or height, say - which a plain `?? default` would happily accept - and the client layouter then collapses the node onto its label because its preferred size
 * resolves to 0. So only positive dimensions count as a persisted size.
 */
export function hasUsableSize(size: StoredSize): size is Dimension {
    return !!size?.width && !!size?.height && size.width > 0 && size.height > 0;
}

/** The stored size where it is usable, the fallback otherwise. */
export function effectiveSize(stored: StoredSize, fallback: Dimension): Dimension {
    return hasUsableSize(stored) ? { width: stored.width, height: stored.height } : fallback;
}

/** The size a node of this AST type is drawn at: what is stored for it, or what the type opens at. */
export function nodeSize(astType: string, stored: StoredSize): Dimension {
    return effectiveSize(stored, getDefaultSize(astType));
}
