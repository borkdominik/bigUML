/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { PACKAGE_TAB_HEIGHT } from '@borkdominik-biguml/uml-glsp-server';
import { svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { NamedElement, NamedElementView } from '../named-element/index.js';

export class GPackageNode extends NamedElement {
    uri: string = '';
    visibility: string = 'PUBLIC';
}

/** How much of a package's width its tab takes up, and the least it may be drawn as. */
const TAB_WIDTH_RATIO = 0.4;
const TAB_MIN_WIDTH = 40;

/**
 * A package, drawn as the folder UML draws it: a tab along the top left and the body below, with the
 * name written in the body.
 *
 * The tab is drawn within the node's own bounds - the contents are laid out clear of it by
 * `PACKAGE_TAB_HEIGHT`, which is what the two sides share - so a package is the size it says it is
 * and is picked up, resized and connected to by the whole of what is drawn.
 */
@injectable()
export class GPackageNodeView extends NamedElementView {
    protected override renderBackground(element: NamedElement): VNode {
        const width = Math.max(0, element.bounds.width);
        const height = Math.max(0, element.bounds.height);
        const tabHeight = Math.min(PACKAGE_TAB_HEIGHT, height);
        const tabWidth = Math.min(width, Math.max(TAB_MIN_WIDTH, width * TAB_WIDTH_RATIO));

        return (
            <path
                class-uml-node-background
                d={
                    // The outline of the whole folder, then the underside of the tab: the outline
                    // draws the body's top edge only where the tab is not standing on it.
                    `M 0,0 H ${tabWidth} V ${tabHeight} H ${width} V ${height} H 0 Z M 0,${tabHeight} H ${tabWidth}`
                }
            />
        ) as any;
    }
}
