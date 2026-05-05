/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { boundsFeature, RectangularNode } from '@eclipse-glsp/client';
import { type Point } from '@eclipse-glsp/protocol';

// TODO: Sequence Diagram Specific
export class SDVerticalShiftNode extends RectangularNode {
    static override readonly DEFAULT_FEATURES = [boundsFeature];
    startPoint: Point;
    endPoint: Point;
}

export class SDHorizontalShiftNode extends RectangularNode {
    static override readonly DEFAULT_FEATURES = [boundsFeature];
    startPoint: Point;
    endPoint: Point;
}
