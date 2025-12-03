/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { UMLSourceModel } from '@borkdominik-biguml/uml-protocol';

export interface Snapshot {
    id: string;
    timestamp: string;
    message: string;
    resources: ResourceSnapshot[];
    model: Readonly<UMLSourceModel>;
    svg?: string;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface ResourceSnapshot {
    uri: string;
    content: string;
}
