/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { AstUtils, type CstNode, DefaultValueConverter, GrammarAST, isLeafCstNode, type ValueType } from 'langium';

/**
 * Gives a value the user typed back exactly as it was written, rather than as the run of tokens it was
 * read as.
 *
 * `LangiumText` - the rule behind every `@Language.text` property - and `LangiumName` - the rule behind
 * every other one that is typed into - are data type rules, a run of tokens rather than one terminal,
 * because a terminal is matched without parser context and a value such as `1` would then always lex as
 * a number and never as a name. Langium builds the value of such a rule by concatenating the images of
 * the tokens it matched, and everything between those images is lost:
 *
 * - the blanks, which are hidden whitespace and belong to no token at all, so `x = 1` read back as `x=1`
 *   and `do / print` as `do/print`;
 * - and, since `LangiumText` also takes the characters JSON is structured with as keywords (see
 *   `terminals.langium`), the blanks around those too - `cancel [retry]` read back as `cancel[retry]`,
 *   because Langium appends a keyword's image without passing it through a converter at all.
 *
 * So the value is not reassembled here, it is simply read back out of the source, which is the one place
 * it still stands as it was typed. This runs once on the finished value rather than once per token,
 * which is what makes the keywords come out right: by the time the parser hands the value over, what
 * they were is no longer visible, but where the value starts and ends still is.
 *
 * Only what someone typed is treated this way. Every other data type rule in this grammar is a fixed
 * set of words - a `Visibility`, an `Orientation` - where the tokens and the source say the same thing
 * anyway.
 */
export class UmlDiagramValueConverter extends DefaultValueConverter {
    override convert(input: string, cstNode: CstNode): ValueType {
        if (!isLeafCstNode(cstNode) && isTypedRule(cstNode)) {
            return sourceTextOf(cstNode);
        }
        return super.convert(input, cstNode);
    }
}

/**
 * Whether this node is the whole of one of the rules that read a value the user typed.
 *
 * A composite node is built against the grammar element that produced it, which for a rule invoked from
 * another rule is the call and not the rule itself; the rule is what the call points at. Both are
 * accepted, since which one a node carries is Langium's business rather than this grammar's.
 */
function isTypedRule(cstNode: CstNode): boolean {
    const source = cstNode.grammarSource;
    const rule = GrammarAST.isRuleCall(source) ? source.rule?.ref : AstUtils.getContainerOfType(source, GrammarAST.isParserRule);
    return rule !== undefined && TYPED_RULES.has(rule.name);
}

/**
 * The rules in `terminals.langium` a typed value is read with: free text for a `@Language.text`
 * property, and a name for every other string property but the id, which is written rather than typed.
 */
const TYPED_RULES = new Set(['LangiumText', 'LangiumName']);

/**
 * The stretch of the file this value was read from.
 *
 * The node spans its own tokens and no more, so the quotes that delimit the value are outside it - they
 * are keywords of the rule that called this one. A line break within is folded to a single blank: a
 * value is written on one line, so a break inside one came from a file someone laid out by hand, and
 * carrying it into a label would only be invisible there.
 */
function sourceTextOf(cstNode: CstNode): string {
    return cstNode.root.fullText.slice(cstNode.offset, cstNode.end).replace(/\s*\r?\n\s*/g, ' ');
}
