/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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

import { isSizeable, LayoutContainer, SParentElement, StatefulLayouter } from '@eclipse-glsp/client';
import { FreeFormLayouter } from '@eclipse-glsp/client/lib/features/layout/freeform-layout';
import { Dimension } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { AbstractLayoutOptions } from 'sprotty/lib/features/bounds/layout-options';

@injectable()
export class UmlFreeFormLayouter extends FreeFormLayouter {
    static override KIND = 'uml-freeform';

    protected override getChildrenSize(
        container: SParentElement & LayoutContainer,
        containerOptions: AbstractLayoutOptions,
        layouter: StatefulLayouter
    ): Dimension {
        let maxX = 0;
        let maxY = 0;
        container.children
            .filter(child => isSizeable(child))
            .forEach(child => {
                const bounds = layouter.getBoundsData(child).bounds;
                if (bounds !== undefined && Dimension.isValid(bounds)) {
                    const childMaxX = bounds.x + bounds.width;
                    const childMaxY = bounds.y + bounds.height;
                    maxX = Math.max(maxX, childMaxX);
                    maxY = Math.max(maxY, childMaxY);
                }
            });
        return {
            width: maxX,
            height: maxY
        };
    }
}
