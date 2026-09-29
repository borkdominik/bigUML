/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { ConnectionPointLayout } from '@borkdominik-biguml/uml-glsp-server';
import {
    isChoice,
    isDecisionNode,
    isFork,
    isForkNode,
    isJoin,
    isJoinNode,
    isMergeNode,
    isNaryAssociation,
    isOpaqueAction
} from '@borkdominik-biguml/uml-model-server/grammar';

/**
 * How an element lays its connection points out, or `undefined` for the shapes that have none.
 *
 * The diamonds and the bars of both the state machine and the activity diagram are drawn the same way,
 * so a pin has to mean the same thing on either. The action offers the two side points its pins sit
 * on, so a flow dropped on one of those dots is pinned there and stays pinned.
 */
export function connectionPointLayoutOf(node: unknown): ConnectionPointLayout | undefined {
    if (isChoice(node) || isDecisionNode(node) || isMergeNode(node) || isNaryAssociation(node)) {
        return 'diamond';
    }
    if (isFork(node) || isJoin(node) || isForkNode(node) || isJoinNode(node)) {
        return 'bar';
    }
    if (isOpaqueAction(node)) {
        return 'sides';
    }
    return undefined;
}
