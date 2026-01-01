/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { isAstNode, isNamed, streamAst } from 'langium';
import { Diagram } from '../../generated/ast.js';

export function findAvailableNodeName(container: Diagram, name: string): string {
    let counter = 1;
    let availableName = name + counter;
    while (streamAst(container).find(node => isAstNode(node) && isNamed(node) && node.name === availableName)) {
        availableName = name + counter++;
    }
    return availableName;
}
