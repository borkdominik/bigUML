/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { storableText } from './storable-text.js';

/**
 * The notation `trigger [guard] / effect`, which UML writes on a transition and again on every line of
 * a state's second compartment - `do / print` is the same three slots with two of them empty.
 *
 * The brackets and the slash are notation rather than data, so the three parts live as separate
 * properties and are only put together to be drawn. That is also what keeps them storable: the model
 * grammar spells JSON structure out in keywords and keeps no terminal that a `[` inside a value could
 * match, and it drops the blanks between the tokens it does match, so a stored `do / print` would read
 * back from the file as `do/print`.
 */

/** The properties a label is composed from, in the order they are written. */
export const BEHAVIOR_LABEL_PARTS = ['trigger', 'guard', 'effect'] as const;

export type BehaviorLabelPart = (typeof BEHAVIOR_LABEL_PARTS)[number];

export type BehaviorLabelParts = { [K in BehaviorLabelPart]?: string };

/**
 * The id the property palette offers the whole notation under, as one field holding the line as it is
 * drawn. There is no such property on any element - it is the three above, put together on the way out
 * and taken apart again on the way in (see `GenericUpdateOperationHandler`). A field per part would ask
 * the user to know where the slash goes, which is the one thing the notation already says.
 */
export const BEHAVIOR_LABEL_PROPERTY_ID = 'behaviorLabel';

/** Writes the notation shown on the element, or `undefined` when it carries no part at all. */
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

/**
 * Reads that notation back apart. Every part is optional, and one the user left out comes back as
 * `undefined` rather than as an empty string - the grammar has no way to write an empty one, since
 * `LangiumText` needs at least one token between the quotes.
 */
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

/**
 * Drops what a part cannot be stored with, the brackets a malformed label leaves behind among them -
 * such as the stray `]` of `a] b`. They are the guard's delimiters, written back by
 * {@link composeBehaviorLabel}, and a stored one would make the model unparseable. So would a comma or
 * a colon typed into any of the three, which is why this is `storableText` rather than a rule about
 * brackets alone.
 */
function storable(part: string | undefined): string | undefined {
    return part === undefined ? undefined : storableText(part);
}

/**
 * A guard as it can be stored: without the brackets the notation writes it in, and `undefined` where
 * nothing is left of it. Written back on by whatever draws it - `composeBehaviorLabel` for a label that
 * is one line of notation, `EdgeGuardLabel` for one that is a guard and nothing else.
 *
 * Taking them off is not tidiness: the grammar spells JSON structure out in keywords and keeps no
 * terminal a `[` inside a value could match, so a stored bracket leaves the model unparseable.
 */
export function storableGuard(text: string): string | undefined {
    return storable(text);
}

/** An element whose label is this notation, plus the name it falls back to before anything is typed. */
export interface BehaviorLabelElement extends BehaviorLabelParts {
    name?: string;
}

export type BehaviorLabelPatch = { op: 'add'; path: string; value: string } | { op: 'remove'; path: string };

export interface BehaviorLabelPatchOptions {
    /**
     * Whether the element is drawn as its label and nothing else, in which case an empty line is refused
     * rather than written - a state's part would be left as a row of no height, which is neither
     * readable nor clickable, and could then only be reached from the property panel. An element that is
     * drawn as a shape of its own may go unlabelled, and a transition does.
     */
    required?: boolean;
    /**
     * Which parts the edited label stands for. All three by default, which is the label that is the whole
     * notation - one line of a state's compartment, or the field the property panel offers.
     *
     * A part left out of this is still *written* when the text carries one, so a guard typed in brackets
     * lands where guards go wherever it was typed. It is never *cleared* though: an edge writes its guard
     * on a label of its own, and the label beside it saying nothing about a guard is not the user saying
     * there is no guard - retyping the trigger would otherwise wipe what the other label holds.
     */
    parts?: readonly BehaviorLabelPart[];
}

/**
 * The patch that writes a typed line onto such an element: all three parts at once, each either
 * written or removed, since a part the user left out cannot be stored as an empty string.
 *
 * `basePath` is the JSON pointer of the element itself, and `element` is what it holds *before* the
 * edit - which is what decides whether a part has to be removed at all, and whether the line that was
 * just typed over was the element's name.
 */
export function behaviorLabelPatch(
    basePath: string,
    element: BehaviorLabelElement,
    text: string,
    options: BehaviorLabelPatchOptions = {}
): BehaviorLabelPatch[] {
    const parts = parseBehaviorLabel(text);
    const stands = options.parts ?? BEHAVIOR_LABEL_PARTS;

    if (options.required && composeBehaviorLabel(parts) === undefined) {
        return [];
    }

    const patch: BehaviorLabelPatch[] = [];
    for (const part of BEHAVIOR_LABEL_PARTS) {
        const path = `${basePath}/${part}`;
        const value = parts[part];
        if (value !== undefined) {
            patch.push({ op: 'add', path, value });
        } else if (stands.includes(part) && element[part] !== undefined) {
            patch.push({ op: 'remove', path });
        }
    }

    // An element that carries none of the parts this label stands for is labelled with its name instead,
    // so that name is what the user just edited - keeping it would leave a second, now invisible label
    // behind, contradicting the one they typed.
    const stood = composeBehaviorLabel(Object.fromEntries(stands.map(part => [part, element[part]])));
    if (stood === undefined && element.name !== undefined) {
        patch.push({ op: 'remove', path: `${basePath}/name` });
    }

    return patch;
}
