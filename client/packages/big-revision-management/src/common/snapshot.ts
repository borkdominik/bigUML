/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type ExperimentalModelState } from "@borkdominik-biguml/big-vscode-integration/vscode";

export interface Snapshot {
    id: string;
    timestamp: string;
    author: string;
    message: string;
    svg: string;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    state: ExperimentalModelState;
}