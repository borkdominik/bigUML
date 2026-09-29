/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { storableText } from '@borkdominik-biguml/uml-glsp-server';

/**
 * The `trigger [guard] / effect` notation a transition and a line of a state's compartment are written
 * in: how the three parts are composed into the one line it is drawn as, and how that line is taken
 * apart again into the three properties it is stored as. Nothing here touches the model; writing the
 * parts back is `BehaviorLabelExtension`'s job.
 */

export const BEHAVIOR_LABEL_PARTS = ['trigger', 'guard', 'effect'] as const;

export type BehaviorLabelPart = (typeof BEHAVIOR_LABEL_PARTS)[number];

export type BehaviorLabelParts = { [K in BehaviorLabelPart]?: string };

/**
 * The property id the property palette offers the whole notation under. Not a property of the element:
 * what comes back is the one line, which `BehaviorLabelExtension` takes apart into the three it stores.
 */
export const BEHAVIOR_LABEL_PROPERTY_ID = 'behaviorLabel';

export function composeBehaviorLabel(parts: BehaviorLabelParts): string | undefined {
    const segments: string[] = [];
    if (parts.trigger) {
        segments.push(parts.trigger);
    }
    if (parts.guard) {
        segments.push(`[${parts.guard}]`);
    }
    if (parts.effect) {
        segments.push(`/ ${parts.effect}`);
    }
    return segments.length > 0 ? segments.join(' ') : undefined;
}

export function parseBehaviorLabel(text: string): BehaviorLabelParts {
    let rest = text.trim();

    // The guard is taken out first: it is the only part with a delimiter of its own, and lifting it
    // out means a `/` written inside it cannot be mistaken for the one that starts the effect.
    let guard: string | undefined;
    const open = rest.indexOf('[');
    if (open >= 0) {
        // An unclosed bracket still reads as the start of a guard - the rest of the label is what
        // the user was writing into it - and closing it here is what keeps the `[` out of a stored
        // value, where the grammar would have no terminal to lex it with.
        const close = rest.indexOf(']', open + 1);
        const end = close >= 0 ? close : rest.length;
        guard = rest.slice(open + 1, end).trim();
        rest = `${rest.slice(0, open)} ${rest.slice(end + 1)}`.trim();
    }

    let effect: string | undefined;
    const slash = rest.indexOf('/');
    if (slash >= 0) {
        effect = rest.slice(slash + 1).trim();
        rest = rest.slice(0, slash).trim();
    }

    return { trigger: storable(rest), guard: storable(guard), effect: storable(effect) };
}

function storable(part: string | undefined): string | undefined {
    return part === undefined ? undefined : storableText(part);
}
