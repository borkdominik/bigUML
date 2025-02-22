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
import { DefaultTypes, GCompartment, type RenderingContext, ShapeView, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { type PackageElement } from './package-element.model.js';

const HEADER_HEIGHT = 40;
const WIDTH_OFFSET = 5;
const HEIGHT_OFFSET = 5;

@injectable()
export class PackageElementView extends ShapeView {
    render(element: PackageElement, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const translate = `translate(${element.bounds.x}, ${element.bounds.y})`;

        const compartmentHeader = element.children.find(
            c => c instanceof GCompartment && c.type === DefaultTypes.COMPARTMENT_HEADER && c.children.length > 0
        ) as GCompartment | undefined;

        // const compartmentBody = element.children.find(
        //     c => c instanceof GCompartment && c.type !== DefaultTypes.COMPARTMENT_HEADER && c.children.length > 0
        // ) as GCompartment | undefined;

        const headerHeight = compartmentHeader ? compartmentHeader.bounds.height + HEIGHT_OFFSET : HEADER_HEIGHT;

        const headerWidth = compartmentHeader ? compartmentHeader.bounds.width + WIDTH_OFFSET : element.bounds.width * (headerHeight / 100);

        return (
            <g transform={translate} class-sprotty-comp>
                <polyline
                    class-sprotty-node
                    class-mouseover={element.hoverFeedback}
                    class-selected={element.selected}
                    points={`
                    1,${headerHeight}
                    1,${element.bounds.height}
                    ${Math.max(element.bounds.width, headerWidth)},${element.bounds.height}
                    ${Math.max(element.bounds.width, headerWidth)},${headerHeight}
                    1,${headerHeight}
                    1,1
                    ${headerWidth},1
                    ${headerWidth},${headerHeight}`}
                />
                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
