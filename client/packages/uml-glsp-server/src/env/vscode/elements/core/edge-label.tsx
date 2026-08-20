/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { CommonModelTypes, storableText } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { GModelElement } from '@eclipse-glsp/server';

/*
 * NOTE: for rotated edge labels GLSP/sprotty interprets `side` in SVG screen coordinates,
 * where y grows downwards: `'bottom'` shifts the label up by `offset + height` (rendering it
 * *above* the edge) and `'top'` shifts it down by `offset` (rendering it *below* the edge).
 * The sides below therefore look inverted on purpose.
 */

/** Above the edge, at its center. */
const NAME_PLACEMENT = { rotate: true, side: 'bottom', position: 0.5, offset: 7 } as const;

/**
 * The same spot, but written upright rather than turned along the edge. GLSP/sprotty picks the side by
 * the quadrant the edge runs in, so the name stays clear of the line whichever way it goes.
 */
const HORIZONTAL_NAME_PLACEMENT = { rotate: false, side: 'bottom', position: 0.5, offset: 7 } as const;

/** Below the edge, so a stereotype does not overlap the name. */
const STEREOTYPE_PLACEMENT = { rotate: true, side: 'top', position: 0.5, offset: 7 } as const;

/** Where the name is written, which is where a guard is written too when the edge carries no name. */
const NAME_POSITION = NAME_PLACEMENT.position;

/**
 * How far along the edge a guard stands off the name it shares the line with. Enough to read as two
 * labels rather than one, and not so far that a guard on a short edge is dragged out to the end of it.
 */
const GUARD_STEP = 0.2;

/*
 * Multiplicities sit above the edge at its two ends. `offset` does double duty here: for
 * `position < 1/3` and `position > 2/3` GLSP/sprotty also insets the label along the edge by
 * that amount, which keeps it clear of the node border and the arrow head.
 */
const SOURCE_MULTIPLICITY_PLACEMENT = { rotate: true, side: 'bottom', position: 0, offset: 7 } as const;
const TARGET_MULTIPLICITY_PLACEMENT = { rotate: true, side: 'bottom', position: 1, offset: 7 } as const;

/** Below the edge, at its two ends, so a role name does not overlap the multiplicity above it. */
const SOURCE_ROLE_NAME_PLACEMENT = { rotate: true, side: 'top', position: 0, offset: 7 } as const;
const TARGET_ROLE_NAME_PLACEMENT = { rotate: true, side: 'top', position: 1, offset: 7 } as const;

/**
 * A property string sits below the edge beside the end it belongs to, just inside the role name written
 * at the end itself - which is where UML writes it, and which keeps the two from being laid one on top
 * of the other.
 */
const SOURCE_MODIFIERS_PLACEMENT = { rotate: true, side: 'top', position: 0.15, offset: 7 } as const;
const TARGET_MODIFIERS_PLACEMENT = { rotate: true, side: 'top', position: 0.85, offset: 7 } as const;

export interface EdgeNameLabelProps {
    id: string;
    name?: string;
    /**
     * How the name is written. `along-edge` (the default) turns it to follow the line, the way the
     * structural diagrams draw relation names. `horizontal` keeps it upright whichever way the line
     * runs - a state machine transition is read as `trigger [guard] / effect`, not as a line caption.
     */
    orientation?: 'along-edge' | 'horizontal';
}

/**
 * Renders the name of a relation on top of the edge. Returns `null` for unnamed
 * relations so that no empty label is added to the edge.
 */
export function EdgeNameLabel(props: EdgeNameLabelProps): GModelElement | null {
    if (!props.name) {
        return null;
    }

    return (
        <GLabelElement
            id={props.id + '_name_label'}
            type={CommonModelTypes.LABEL_EDGE_NAME}
            text={props.name}
            args={{ highlight: true }}
            edgePlacement={props.orientation === 'horizontal' ? HORIZONTAL_NAME_PLACEMENT : NAME_PLACEMENT}
        />
    );
}

/**
 * What the id of a guard label ends in. Read back by `GenericLabelEditOperationHandler` to tell which
 * property the edit belongs to: every other label on an edge writes the element's name, and a guard
 * label edited as a name would put the condition where the name goes.
 */
export const EDGE_GUARD_LABEL_SUFFIX = '_guard_label';

export interface EdgeGuardLabelProps {
    id: string;
    guard?: string;
    /** Whether the edge also writes its name on the line, which the guard then has to keep clear of. */
    named?: boolean;
    /** How the guard is written, matching the name of the same edge - see `EdgeNameLabelProps`. */
    orientation?: 'along-edge' | 'horizontal';
}

/**
 * Renders the guard of an edge on the line, in the brackets the notation writes it in - `[x > 0]`. The
 * brackets are notation and not data, so they are put on here rather than stored, and a guard that is
 * not set gets no label at all rather than an empty pair of them.
 *
 * Written like the name and in the same place, except where the edge carries a name as well: the two
 * would then be laid one on top of the other, so the guard steps along the line to clear it - after the
 * name where the name is written first, before it where the name is written later. Either way the pair
 * keeps to the middle of the edge rather than running out to an end of it.
 */
export function EdgeGuardLabel(props: EdgeGuardLabelProps): GModelElement | null {
    if (!props.guard) {
        return null;
    }

    const position = props.named ? (NAME_POSITION <= 0.5 ? NAME_POSITION + GUARD_STEP : NAME_POSITION - GUARD_STEP) : NAME_POSITION;

    return (
        <GLabelElement
            id={props.id + EDGE_GUARD_LABEL_SUFFIX}
            type={CommonModelTypes.LABEL_EDGE_NAME}
            text={`[${props.guard}]`}
            // The same editable label the name is, so the condition can be retyped on the line it is
            // written on. What comes back has the brackets taken off again - see the suffix above.
            args={{ highlight: true }}
            edgePlacement={{ rotate: props.orientation !== 'horizontal', side: 'bottom', position, offset: 7 }}
        />
    );
}

export interface EdgeMultiplicityLabelProps {
    id: string;
    /** Which end of the relation the multiplicity belongs to. */
    end: 'source' | 'target';
    multiplicity?: string;
}

/**
 * Renders the multiplicity of one relation end next to that end of the edge. Returns `null`
 * when the end has no multiplicity, so that no empty label is added to the edge.
 */
export function EdgeMultiplicityLabel(props: EdgeMultiplicityLabelProps): GModelElement | null {
    if (!props.multiplicity) {
        return null;
    }

    return (
        <GLabelElement
            id={`${props.id}_${props.end}_multiplicity_label`}
            type={CommonModelTypes.LABEL_TEXT}
            text={props.multiplicity}
            edgePlacement={props.end === 'source' ? SOURCE_MULTIPLICITY_PLACEMENT : TARGET_MULTIPLICITY_PLACEMENT}
        />
    );
}

export interface EdgeRoleNameLabelProps {
    id: string;
    /** Which end of the relation the role name belongs to. */
    end: 'source' | 'target';
    name?: string;
}

/**
 * Renders the role name of one relation end below that end of the edge. Returns `null`
 * when the end has no role name, so that no empty label is added to the edge.
 */
export function EdgeRoleNameLabel(props: EdgeRoleNameLabelProps): GModelElement | null {
    if (!props.name) {
        return null;
    }

    return (
        <GLabelElement
            id={`${props.id}_${props.end}_role_name_label`}
            type={CommonModelTypes.LABEL_TEXT}
            text={props.name}
            edgePlacement={props.end === 'source' ? SOURCE_ROLE_NAME_PLACEMENT : TARGET_ROLE_NAME_PLACEMENT}
        />
    );
}

/** What the id of a property string label ends in, per end - read back by the label edit handler. */
export const EDGE_MODIFIERS_LABEL_SUFFIX = '_modifiers_label';

export interface EdgeModifiersLabelProps {
    id: string;
    /** Which end of the relation the property string belongs to. */
    end: 'source' | 'target';
    modifiers?: string;
}

/**
 * Renders the property string of one relation end beside that end, in the braces UML writes it in -
 * `{ordered}`, `{subsets owner}`. Returns `null` where the end carries none, so that no empty pair of
 * braces is added to the edge.
 *
 * Editable in place like the name and the guard are. The braces are notation: they are put on here and
 * taken off again by `storableModifiers` on the way back, which is also what keeps the value storable at
 * all - the grammar has no terminal a `{` inside a value could match.
 */
export function EdgeModifiersLabel(props: EdgeModifiersLabelProps): GModelElement | null {
    if (!props.modifiers) {
        return null;
    }

    return (
        <GLabelElement
            id={`${props.id}_${props.end}${EDGE_MODIFIERS_LABEL_SUFFIX}`}
            type={CommonModelTypes.LABEL_EDGE_NAME}
            text={`{${props.modifiers}}`}
            args={{ highlight: true }}
            edgePlacement={props.end === 'source' ? SOURCE_MODIFIERS_PLACEMENT : TARGET_MODIFIERS_PLACEMENT}
        />
    );
}

/**
 * A property string as it can be stored: without the braces it is written in, and `undefined` where
 * nothing is left of it. The braces come off as part of `storableText`, which takes out everything the
 * grammar has no terminal for - the commas of `{ordered, unique}` among them, so what comes back is
 * `ordered unique` rather than a file that will not open.
 */
export function storableModifiers(text: string): string | undefined {
    return storableText(text);
}

export interface EdgeStereotypeLabelProps {
    id: string;
    stereotype: string;
}

/** Renders `<<stereotype>>` below the edge. */
export function EdgeStereotypeLabel(props: EdgeStereotypeLabelProps): GModelElement {
    return (
        <GLabelElement
            id={props.id + '_stereotype_label'}
            type={CommonModelTypes.LABEL_TEXT}
            text={`<<${props.stereotype}>>`}
            edgePlacement={STEREOTYPE_PLACEMENT}
        />
    );
}
