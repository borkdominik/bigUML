/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Point } from '@eclipse-glsp/protocol';
import type { Position } from '../../grammar.js';

export function positionToPoint(position: Position): Point {
    return { x: position.x, y: position.y };
}
