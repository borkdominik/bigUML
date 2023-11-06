/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    alignFeature,
    hasArguments,
    layoutableChildFeature,
    RectangularNodeView,
    RenderingContext,
    SArgumentable,
    SCompartment,
    svg
} from '@eclipse-glsp/client';
import { Args, DefaultTypes } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { LabeledNode } from '../../../features/graph/views/label.view';

export class NamedElement extends LabeledNode implements SArgumentable {
    static override readonly DEFAULT_FEATURES = [...LabeledNode.DEFAULT_FEATURES, alignFeature, layoutableChildFeature];

    args: Args = {};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class NamedElementView extends RectangularNodeView {
    override render(element: NamedElement, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const compartment = element.children.find(
            c =>
                c instanceof SCompartment &&
                c.type !== DefaultTypes.COMPARTMENT_HEADER &&
                c.children.length > 0 &&
                hasArguments(c) &&
                c.args['divider'] === true
        ) as SCompartment | undefined;

        // TODO: Remove after switching to builder based approach for all gmodels
        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                {(element.args['border'] === true || element.args['build_by'] === undefined) && (
                    <rect x={0} y={0} rx={2} ry={2} width={Math.max(0, element.bounds.width)} height={Math.max(0, element.bounds.height)} />
                )}

                {compartment && (
                    <path
                        class-uml-comp-separator
                        d={`M 0,${compartment.position.y}  L ${element.bounds.width},${compartment.position.y}`}
                    ></path>
                )}

                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
