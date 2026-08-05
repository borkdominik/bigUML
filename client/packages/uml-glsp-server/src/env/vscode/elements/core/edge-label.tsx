/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
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

/** Below the edge, so a stereotype does not overlap the name. */
const STEREOTYPE_PLACEMENT = { rotate: true, side: 'top', position: 0.5, offset: 7 } as const;

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

export interface EdgeNameLabelProps {
    id: string;
    name?: string;
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
            edgePlacement={NAME_PLACEMENT}
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
