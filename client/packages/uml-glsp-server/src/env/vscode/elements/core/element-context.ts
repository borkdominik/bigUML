/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Dimension, Point } from '@eclipse-glsp/protocol';
import type { DiagramModelIndex } from '../../features/model/diagram-model-index.js';

export interface ElementContext<T = unknown> {
    modelIndex: DiagramModelIndex;
    node: T;
    diagramType: string;
    elementType: string;
}

export interface BaseElementProps {
    type: string;
    position?: Point;
    size?: Dimension;
}

export interface BaseEdgeProps {
    type: string;
}
