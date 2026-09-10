/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

export interface SearchResult {
    id: string;
    type: string;
    name: string;
    parentName?: string;
    details?: string;
    /**
     * Editable scalar string properties on the underlying element (e.g. `name`,
     * `visibility`). Populated by matchers; the replace UI uses these for the
     * property selector and per-row preview when a non-`name` property is
     * targeted. The map's `name` value is the raw element name — distinct from
     * the display `name` field, which may be a synthesized label (e.g. a
     * relation's "Source → Target" string).
     */
    properties?: Record<string, string>;
    svg?: string;
    bounds?: { x: number; y: number; width: number; height: number };
    /** For relations: the semantic ids of the connected source/target elements, used to build a composite preview. */
    sourceId?: string;
    targetId?: string;
}
