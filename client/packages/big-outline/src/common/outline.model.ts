/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

/**
 * A node entry for the outline tree.
 */
export interface OutlineTreeNode {
    /**
     * Label that is displayed in the tree.
     */
    label: string;
    /**
     * Id of the node.
     */
    semanticUri: string;
    children: OutlineTreeNode[];
    iconClass: string;
    isRoot: boolean;
}
