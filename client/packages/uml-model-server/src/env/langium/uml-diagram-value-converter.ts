/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { AstUtils, type CstNode, DefaultValueConverter, GrammarAST, GrammarUtils, isLeafCstNode, type ValueType } from 'langium';

/**
 * Keeps the blanks a free-text value was typed with.
 *
 * `LangiumText` - the rule behind every `@Language.text` property - is a data type rule, a run of
 * tokens rather than one terminal, because a terminal is matched without parser context and a value
 * such as `1` would then always lex as a number and never as a name. Langium builds the value of such
 * a rule by concatenating the images of the tokens it matched, and the blanks between them are hidden
 * whitespace and belong to no token at all - so a stored `x = 1` read back from the file as `x=1`, and
 * `do / print` as `do/print`.
 *
 * Only the blanks around punctuation were lost, which is what made this so easy to miss: a blank
 * *inside* a word run is part of a single `LANGIUM_ID` and always survived, so `print the report` came
 * back whole while `print (the report)` lost both of its blanks. And it was only lost on the way back
 * in - what the user typed is what the diagram showed until the file was reopened.
 *
 * The gap is read back out of the source text, which is the only place it still exists.
 */
export class UmlDiagramValueConverter extends DefaultValueConverter {
    override convert(input: string, cstNode: CstNode): ValueType {
        if (isLeafCstNode(cstNode) && isDataTypeToken(cstNode)) {
            // Taken as the text it stands for, whatever the token's own terminal returns. A token here is
            // not a value in itself - it is one piece of a value still being concatenated, and the rule's
            // own type is applied once to the finished string (see `LangiumParser.construct`). Converting
            // per token also dropped the gap in front of a number, `x = 1` reading back as `x =1`, since a
            // number has nowhere to carry it.
            return precedingBlanks(cstNode) + input;
        }
        return super.convert(input, cstNode);
    }
}

/**
 * Whether this token is one of several making up a data type rule's value - the only place a gap
 * between two tokens is part of what the user wrote. Every other token is a value in itself, where
 * the blanks in front of it are the file's own indentation.
 */
function isDataTypeToken(cstNode: CstNode): boolean {
    const rule = AstUtils.getContainerOfType(cstNode.grammarSource, GrammarAST.isParserRule);
    return rule !== undefined && GrammarUtils.isDataTypeRule(rule);
}

/**
 * The blanks standing between this token and the one before it, or none where it is the first token of
 * the value. Leading blanks are not part of it: they sit against the opening quote, the value has never
 * carried them, and they would be invisible in every field that shows it.
 *
 * Line breaks are left out for the same reason - a value is written on one line, so a break before a
 * token is the file's layout and not the value's.
 */
function precedingBlanks(cstNode: CstNode): string {
    const text = cstNode.root.fullText;
    let start = cstNode.offset;
    while (start > 0 && (text.charAt(start - 1) === ' ' || text.charAt(start - 1) === '\t')) {
        start--;
    }
    if (start === cstNode.offset || text.charAt(start - 1) === '"') {
        return '';
    }
    return text.slice(start, cstNode.offset);
}
