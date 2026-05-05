/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isAstNode, isNamed, streamAst } from 'langium';
import { type Diagram } from '../../grammar.js';

export function findAvailableNodeName(container: Diagram, name: string): string {
    let counter = 1;
    let availableName = name + counter;
    while (streamAst(container).find(node => isAstNode(node) && isNamed(node) && node.name === availableName)) {
        availableName = name + counter++;
    }
    return availableName;
}
