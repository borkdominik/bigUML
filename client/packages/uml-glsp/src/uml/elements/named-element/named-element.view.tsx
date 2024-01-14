/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ArgsAware, GCompartment, hasArgs, layoutableChildFeature, RectangularNodeView, RenderingContext, svg } from '@eclipse-glsp/client';
import { Args, DefaultTypes } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
// eslint-disable-next-line no-restricted-imports
import { alignFeature } from 'sprotty';
import { GLabeledNode } from '../../views/label.view';

export class NamedElement extends GLabeledNode implements ArgsAware {
    static override readonly DEFAULT_FEATURES = [...GLabeledNode.DEFAULT_FEATURES, alignFeature, layoutableChildFeature];

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
                c instanceof GCompartment &&
                c.type !== DefaultTypes.COMPARTMENT_HEADER &&
                c.children.length > 0 &&
                hasArgs(c) &&
                c.args['divider'] === true
        ) as GCompartment | undefined;

        // TODO: Remove after switching to builder based approach for all gmodels
        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                {(element.args['border'] === true || element.args['build_by'] === undefined) && (
                    <rect
                        x={0}
                        y={0}
                        rx={2}
                        ry={2}
                        width={Math.max(0, element.bounds.width)}
                        height={Math.max(0, element.bounds.height)}
                        class-uml-node-background
                    />
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
