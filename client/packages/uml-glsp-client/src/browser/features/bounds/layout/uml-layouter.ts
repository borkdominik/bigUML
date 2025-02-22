/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type BoundsData, type GModelElement, type GParentElement, isLayoutContainer, type LayoutContainer, Layouter } from '@eclipse-glsp/client';
import { StatefulLayouterExt } from '@eclipse-glsp/client/lib/features/bounds/layouter.js';
import { isEqual } from 'lodash';

export class UMLLayouterExt extends Layouter {
    override layout(element2boundsData: Map<GModelElement, BoundsData>): void {
        new UMLStatefulLayouterExt(element2boundsData, this.layoutRegistry, this.logger).layout();
    }
}

export class UMLStatefulLayouterExt extends StatefulLayouterExt {
    override layout(): void {
        // First pass: apply layout with cleared container data. Will get
        // preferred size for all elements (Children first, then parents)
        while (this.toBeLayouted2.length > 0) {
            const element = this.toBeLayouted2.at(-1)!;
            this.doLayout(element);
        }

        // Second pass: apply layout with initial size data for all
        // nodes. Update the position/size of all elements, taking
        // vGrab/hGrab into account (parent -> children).
        let rerun = false;
        const containers = this.allLayoutContainers();

        do {
            this.toBeLayouted2 = [...containers];
            const containerBoundsBefore = containers.map(e => this.elementToBoundsData.get(e)?.bounds);
            while (this.toBeLayouted2.length > 0) {
                const element = this.toBeLayouted2[0];
                this.doLayout(element);
            }

            const containerBoundsAfter = containers.map(e => this.elementToBoundsData.get(e)?.bounds);

            let boundsChanged = false;
            for (let i = 0; i < containers.length; i++) {
                if (!isEqual(containerBoundsBefore[i], containerBoundsAfter[i])) {
                    boundsChanged = true;
                    break;
                }
            }

            rerun = boundsChanged;
        } while (rerun);
    }

    protected allLayoutContainers(): (GParentElement & LayoutContainer)[] {
        const containers: (GParentElement & LayoutContainer)[] = [];
        this.elementToBoundsData.forEach((_data, element) => {
            if (isLayoutContainer(element)) {
                containers.push(element);
            }
        });

        return containers;
    }
}
