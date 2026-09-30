/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
/** @jsxImportSource @borkdominik-biguml/uml-glsp-server/jsx */

import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { GModelElement } from '@eclipse-glsp/server';
import { propertyLabelId } from '../../notation/label-ids.js';

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

/**
 * Below the edge, opposite the name. A guard is written here when the edge carries a name as well, so the
 * two stand either side of the line at its middle - clear of each other on an edge of any length, which
 * stepping one along the line from the other is not.
 */
const GUARD_UNDER_NAME_PLACEMENT = { ...NAME_PLACEMENT, side: 'top' } as const;

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
 * A property string sits at the end it belongs to, on the side the role name is written on: under the
 * role name where the end has one - one line further from the edge - and in its place where it has none.
 *
 * Only the distance from the line grows. `offset` also says how far in from the end of the edge a label
 * starts, so it stays the role name's and the extra distance goes in `perpendicularOffset`, which the
 * client reads for that alone (see `UmlEdgePlacement`) - the two labels line up at the same start.
 */
const MODIFIERS_LINE_OFFSET = 18;
function modifiersPlacement(end: 'source' | 'target', belowRoleName: boolean) {
    const offset = SOURCE_ROLE_NAME_PLACEMENT.offset;
    return {
        rotate: true,
        side: 'top',
        position: end === 'source' ? 0 : 1,
        offset,
        ...(belowRoleName ? { perpendicularOffset: offset + MODIFIERS_LINE_OFFSET } : {})
    } as const;
}

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
            id={propertyLabelId(props.id, 'name')}
            type={CommonModelTypes.LABEL_EDGE_NAME}
            text={props.name}
            args={{ highlight: true }}
            edgePlacement={props.orientation === 'horizontal' ? HORIZONTAL_NAME_PLACEMENT : NAME_PLACEMENT}
        />
    );
}

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
 * Written like the name and in the same place, above the middle of the edge - except where the edge
 * carries a name as well, which is then above the line and the guard below it.
 */
export function EdgeGuardLabel(props: EdgeGuardLabelProps): GModelElement | null {
    if (!props.guard) {
        return null;
    }

    const placement = props.named ? GUARD_UNDER_NAME_PLACEMENT : NAME_PLACEMENT;

    return (
        <GLabelElement
            id={propertyLabelId(props.id, 'guard')}
            type={CommonModelTypes.LABEL_EDGE_NAME}
            text={`[${props.guard}]`}
            // The same editable label the name is, so the condition can be retyped on the line it is
            // written on. The id names the property the label stands for - see `propertyLabelId`.
            args={{ highlight: true }}
            edgePlacement={{ ...placement, rotate: props.orientation !== 'horizontal' }}
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
            // Editable in place: the id names the property the edit is written back to (see `labelProperty`).
            id={propertyLabelId(props.id, `${props.end}Multiplicity`)}
            type={CommonModelTypes.LABEL_EDGE_NAME}
            text={props.multiplicity}
            args={{ highlight: true }}
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
            // Editable in place: the id names the property the edit is written back to (see `labelProperty`).
            id={propertyLabelId(props.id, `${props.end}Name`)}
            type={CommonModelTypes.LABEL_EDGE_NAME}
            text={props.name}
            args={{ highlight: true }}
            edgePlacement={props.end === 'source' ? SOURCE_ROLE_NAME_PLACEMENT : TARGET_ROLE_NAME_PLACEMENT}
        />
    );
}

export interface EdgeModifiersLabelProps {
    id: string;
    /** Which end of the relation the property string belongs to. */
    end: 'source' | 'target';
    modifiers?: string;
    /** Whether the end also carries a role name, which the property string is then written under. */
    belowRoleName?: boolean;
}

/**
 * Renders the property string of one relation end beside that end, in the braces UML writes it in -
 * `{ordered}`, `{subsets owner}`. Returns `null` where the end carries none, so that no empty pair of
 * braces is added to the edge.
 *
 * Editable in place like the name and the guard are. The braces are notation: they are put on here and
 * taken off again by the label edit handler on the way back, which is also what keeps the value storable
 * at all - the grammar has no terminal a `{` inside a value could match.
 */
export function EdgeModifiersLabel(props: EdgeModifiersLabelProps): GModelElement | null {
    if (!props.modifiers) {
        return null;
    }

    return (
        <GLabelElement
            id={propertyLabelId(props.id, `${props.end}Modifiers`)}
            type={CommonModelTypes.LABEL_EDGE_NAME}
            text={`{${props.modifiers}}`}
            args={{ highlight: true }}
            edgePlacement={modifiersPlacement(props.end, props.belowRoleName ?? false)}
        />
    );
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
