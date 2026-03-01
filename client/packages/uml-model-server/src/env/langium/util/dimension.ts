/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Dimension } from '@eclipse-glsp/protocol';
import type { Size } from '../../grammar.js';

export function sizeToDimension(size: Size): Dimension {
    return { width: size.width, height: size.height };
}
