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

import { Point } from '@eclipse-glsp/protocol';
import { DrawHorizontalShiftAction } from '../tool-feedback/horizontal-shift-tool-feedback';
import { DrawVerticalShiftAction } from '../tool-feedback/vertical-shift-tool-feedback';

export interface IShiftBehavior {
    readonly entireElement: boolean;
    readonly entireEdge: boolean;
}

export class ShiftUtil {
    protected startPoint: Point;
    protected currentPoint: Point;
    protected shiftBehavior: IShiftBehavior;

    constructor(shiftBehavior?: IShiftBehavior) {
        if (shiftBehavior) {
            this.shiftBehavior = shiftBehavior;
        } else {
            this.shiftBehavior = { entireElement: false, entireEdge: false };
        }
    }

    updateStartPoint(position: Point): void {
        this.startPoint = position;
    }

    updateCurrentPoint(position: Point): void {
        this.currentPoint = position;
    }

    drawVerticalShiftAction(): DrawVerticalShiftAction {
        return DrawVerticalShiftAction.create({ startPoint: this.startPoint, endPoint: this.currentPoint });
    }

    drawHorizontalShiftAction(): DrawHorizontalShiftAction {
        return DrawHorizontalShiftAction.create({ startPoint: this.startPoint, endPoint: this.currentPoint });
    }
}
