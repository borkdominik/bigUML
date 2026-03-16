/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Point } from '@eclipse-glsp/protocol';
import { SDDrawHorizontalShiftAction } from '../tool-feedback/horizontal-shift-tool-feedback.js';
import { SDDrawVerticalShiftAction } from '../tool-feedback/vertical-shift-tool-feedback.js';

// TODO: Sequence Diagram Specific
export interface SDIShiftBehavior {
    readonly entireElement: boolean;
    readonly entireEdge: boolean;
}

export class SDShiftUtil {
    protected startPoint: Point;
    protected currentPoint: Point;
    protected shiftBehavior: SDIShiftBehavior;

    constructor(shiftBehavior?: SDIShiftBehavior) {
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

    drawVerticalShiftAction(): SDDrawVerticalShiftAction {
        return SDDrawVerticalShiftAction.create({ startPoint: this.startPoint, endPoint: this.currentPoint });
    }

    drawHorizontalShiftAction(): SDDrawHorizontalShiftAction {
        return SDDrawHorizontalShiftAction.create({ startPoint: this.startPoint, endPoint: this.currentPoint });
    }
}
