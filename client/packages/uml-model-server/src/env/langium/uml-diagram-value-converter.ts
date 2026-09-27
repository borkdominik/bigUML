/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type CstNode, DefaultValueConverter, type GrammarAST, type ValueType } from 'langium';

/**
 * Reads a string value back the way JSON writes it.
 *
 * Every string in the file is one `STRING` token - a name, free text, an id, the id a reference is
 * written with - quoted and escaped as `JSON.stringify` wrote it. Langium's own string conversion only
 * takes the quotes off and knows a handful of escapes; `JSON.parse` is the exact inverse of what wrote
 * the value, `\uXXXX` included.
 */
export class UmlDiagramValueConverter extends DefaultValueConverter {
    protected override runConverter(rule: GrammarAST.AbstractRule, input: string, cstNode: CstNode): ValueType {
        if (rule.name === 'STRING') {
            return JSON.parse(input) as string;
        }
        return super.runConverter(rule, input, cstNode);
    }
}
