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
    /**
     * How much bigger than its 43x63 base drawing the figure is rendered. Applied to the coordinates
     * rather than as a `transform` on the group: the node is sized from `getBBox`, which ignores an
     * element's own transform, so a scaled group would draw past the bounds the layout hands out and
     * run into the name below it.
     */
    protected readonly scale: number = 1.15;

    override render(element: StickFigureNode, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const actorParentNode = (element.parent as GCompartment).parent as GNode;
        const s = (value: number): number => value * this.scale;

        return (
            <g class-selected={actorParentNode.selected} class-mouseover={actorParentNode.hoverFeedback}>
                <line x1={0} y1={0} x2={s(43)} y2={0} visibility='hidden' /> {/* For alignment */}
                {/* Stickfigure https://commons.wikimedia.org/wiki/File:UML-UseCase-Generalisierung3.svg */}
                <circle cx={s(21)} cy={s(15)} r={s(8)} />
                <line x1={s(21)} y1={s(23)} x2={s(21)} y2={s(43)} />
                <line x1={s(6)} y1={s(31)} x2={s(36)} y2={s(31)} />
                <line x1={s(21)} y1={s(43)} x2={s(9)} y2={s(63)} />
                <line x1={s(21)} y1={s(43)} x2={s(33)} y2={s(63)} />
            </g>
        ) as any;
    }
}

/**
 * The actor of an information flow diagram. Drawn bigger than the use case one, where the figure is
 * only ever read next to use cases of its own size - here it stands beside classes and is the only
 * shape carrying its meaning, since the actor is drawn as the figure alone rather than in a box.
 */
@injectable()
export class InformationFlowStickFigureView extends StickFigureView {
    protected override readonly scale: number = 1.8;
}
