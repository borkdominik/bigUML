/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Common model type constants shared across all diagram types.
 */
export namespace CommonModelTypes {
    export const LABEL_HEADING = 'uml-label:heading';
    export const LABEL_NAME = 'uml-label:name';
    export const LABEL_TEXT = 'uml-label:text';
    export const LABEL_EDGE_NAME = 'uml-label:edge-name';
    export const COMP_HEADER = 'uml-comp:header';
    export const COMP_ROOT_COMPONENT = 'uml-comp:root-component';
    export const COMP_CONTAINER = 'uml-comp:container';
    export const LABEL_ICON = 'uml-label:icon';
    export const EDGE = 'uml-edge';
    export const ICON = 'uml-icon';
    export const ICON_CSS = 'uml-icon:css';
    export const DIVIDER = 'uml-divider';
    export const STRUCTURE = 'uml-struct';
    export const MISSING_NODE = 'uml-missingNode';
    /** A named connection point of a shape that has them - one of the four tips of a choice diamond. */
    export const CONNECTION_POINT = 'uml-port:connection-point';
    /**
     * The band a region of a composite state is drawn as, and the compartment its parts are written in.
     *
     * Both carry a type of their own rather than the plain compartment type, because both are given a
     * height by the user and a compartment only gets resize handles through a `ShapeTypeHint` of its own
     * (see `UmlDiagramConfiguration.shapeTypeHints`) - a hint is keyed by element type, so a type shared
     * with every other compartment in every diagram could not carry one.
     */
    export const COMP_STATE_REGION = 'uml-comp:state-region';
    export const COMP_STATE_PARTS = 'uml-comp:state-parts';
}

/**
 * Key of the `args` entry a node carries its name in when the name belongs beside the shape rather
 * than inside it - a fork/join bar, a choice diamond. Those shapes are too small to hold a name, and
 * a label child placed outside them would be measured back into the node's own size, growing it on
 * every render, so the view draws the name itself and reads it from here.
 */
export const OUTSIDE_LABEL_ARG = 'outsideLabel';

/**
 * The height of the tab a package is drawn with - the flap along its top edge that makes the shape
 * read as a folder, which is how UML draws a package.
 *
 * The tab is drawn inside the node's own bounds rather than above them, so that a package is the size
 * it says it is and is picked up and resized by the whole of what is drawn. Its contents are laid out
 * clear of the tab by exactly this much (see `createPackageElement`), and the view draws the tab to
 * the same height (see `GPackageNodeView`) - which is why the measure is shared rather than written
 * on both sides.
 */
export const PACKAGE_TAB_HEIGHT = 16;

/**
 * How far the turned-down corner of a note reaches in from its top right, in both directions.
 *
 * The fold is drawn inside the note's own bounds rather than hanging off them, so that a note is the
 * size it says it is and is picked up and resized by the whole of what is drawn. Its text is inset
 * clear of the fold by exactly this much (see `GNoteNodeElement`), and the view draws the corner to the
 * same reach (see `GNoteNodeView`) - which is why the measure is shared rather than written on both
 * sides, the way a package's tab is.
 */
export const NOTE_FOLD_SIZE = 14;
