/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { UpdateOperation } from '@borkdominik-biguml/uml-glsp-server';
import type { IdAstNode } from '@borkdominik-biguml/uml-model-server';
import type { CreateNodeOperation } from '@eclipse-glsp/server';
import type * as jsonpatch from 'fast-json-patch';
import type { AstNode } from 'langium';

/**
 * The seam through which one diagram's notation extends the generic mutation handlers.
 *
 * The handlers know how a node is created, moved, connected, renamed and given a value - for every
 * element alike. What one element does *differently* - a state that opens into a frame when it is
 * given a region, a bar that is turned by swapping its bounds, a transition whose label is three
 * properties at once - is an extension bound under this symbol, found by the handlers through
 * `@multiInject`. Each hook either claims the case by returning the operations to write (an empty
 * array claims it and writes nothing) or returns `undefined` to leave it to the generic handling.
 */
export const MutationExtension = Symbol('MutationExtension');

export interface NodeCreated {
    operation: CreateNodeOperation;
    /** The JSON pointer the node was added at - `.../<property>/-` of its container, or the diagram's own list. */
    containerPath: string;
    /** The node as written, with its id. */
    node: { $type: string; __id: string };
}

export interface BoundsChange {
    elementId: string;
    element: IdAstNode;
    newSize?: { width: number; height: number };
    newPosition?: { x: number; y: number };
    /** Whether the operation moved the element to a different position. */
    moved: boolean;
    /** Whether the operation gave the element a different size. */
    resized: boolean;
}

export interface EdgeEnds {
    source?: IdAstNode;
    target?: IdAstNode;
}

export interface PropertyUpdate {
    operation: UpdateOperation;
    element: IdAstNode | undefined;
    /** The JSON pointer of the element, where it is known to the index. */
    elementPath: string | undefined;
    /** The operation the generic handler would write for this update, for an extension that adds to it. */
    writeProperty(): jsonpatch.Operation | undefined;
}

export interface LabelEdit {
    labelId: string;
    text: string;
    node: AstNode;
    semanticId: string;
    elementPath: string;
    /** The property the label stands for, read off its id (see `labelProperty`). */
    property: string | undefined;
}

export interface MutationExtension {
    /** Operations to write alongside a node that was just created - resizing the container it went into, say. */
    afterNodeCreated?(created: NodeCreated): jsonpatch.Operation[];

    /** Takes a bounds change over entirely, for an element whose bounds are not stored as its own. */
    claimBoundsChange?(change: BoundsChange): jsonpatch.Operation[] | undefined;

    /** Operations to write alongside an element's new bounds. */
    afterBoundsChange?(change: BoundsChange): jsonpatch.Operation[];

    /** Reads the two ends of a new edge off what was clicked, where that is not simply the two elements. */
    resolveEdgeEnds?(source: IdAstNode | undefined, target: IdAstNode | undefined): EdgeEnds | undefined;

    /** Takes a property update over, for a property id that stands for something other than one property. */
    updateProperty?(update: PropertyUpdate): jsonpatch.Operation[] | undefined;

    /** Takes a label edit over, for a label that stands for something other than one property. */
    editLabel?(edit: LabelEdit): jsonpatch.Operation[] | undefined;
}

/** The first claim any extension makes, or `undefined` where none does. */
export function firstClaim<T>(
    extensions: readonly MutationExtension[],
    claim: (extension: MutationExtension) => T | undefined
): T | undefined {
    for (const extension of extensions) {
        const result = claim(extension);
        if (result !== undefined) {
            return result;
        }
    }
    return undefined;
}
