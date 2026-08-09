/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { AstUtils, isAstNode, isNamed } from 'langium';
import { type Diagram } from '../../grammar.js';

/** Whether any element of the diagram already goes by this name. */
export function isNodeNameTaken(container: Diagram, name: string): boolean {
    return !!AstUtils.streamAst(container).find(node => isAstNode(node) && isNamed(node) && node.name === name);
}

/**
 * A numbered name no element of the diagram carries.
 *
 * `claimed` names count as taken without being in the diagram yet. One edit can add several elements at
 * once - the two lanes of a swimlane are written by a single patch - and until that patch is applied the
 * diagram knows about none of them, so each would otherwise be handed the same name as the one before.
 */
export function findAvailableNodeName(container: Diagram, name: string, claimed: ReadonlySet<string> = new Set()): string {
    let counter = 1;
    let availableName = name + counter;
    while (isNodeNameTaken(container, availableName) || claimed.has(availableName)) {
        availableName = name + ++counter;
    }
    return availableName;
}
