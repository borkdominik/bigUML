/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

export interface OutlineTreeNode {
    label: string;
    semanticUri: string;
    children: OutlineTreeNode[];
    iconClass: string;
    isRoot: boolean;
}
