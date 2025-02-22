/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
/** @jsx svg */
import {
    boundsFeature,
    fadeFeature,
    type GCompartment,
    type GNode,
    GShapeElement,
    layoutableChildFeature,
    layoutContainerFeature,
    type RenderingContext,
    ShapeView,
    svg
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
// eslint-disable-next-line no-restricted-imports
import { alignFeature } from 'sprotty';

export class StickFigureNode extends GShapeElement {
    static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, fadeFeature, alignFeature, layoutableChildFeature];
}

@injectable()
export class StickFigureView extends ShapeView {
    override render(element: StickFigureNode, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const actorParentNode = (element.parent as GCompartment).parent as GNode;

        return (
            <g class-selected={actorParentNode.selected} class-mouseover={actorParentNode.hoverFeedback}>
                <line x1='0' y1='0' x2='43' y2='0' visibility='hidden' /> {/* For alignment */}
                {/* Stickfigure https://commons.wikimedia.org/wiki/File:UML-UseCase-Generalisierung3.svg */}
                <circle cx='21' cy='15' r='8' />
                <line x1='21' y1='23' x2='21' y2='43' />
                <line x1='6' y1='31' x2='36' y2='31' />
                <line x1='21' y1='43' x2='9' y2='63' />
                <line x1='21' y1='43' x2='33' y2='63' />
            </g>
        ) as any;
    }
}
