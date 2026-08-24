/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { TokenType, TokenVocabulary } from 'chevrotain';
import { AstUtils, DefaultTokenBuilder, type Grammar, GrammarAST, RegExpUtils, type TokenBuilderOptions } from 'langium';

/**
 * Where a keyword may legally appear in the JSON-shaped concrete syntax.
 *
 * The generated grammar spells every JSON field out as keywords, e.g.
 * `'"name"' ':' '"' name=LangiumName '"'`. Chevrotain lexes without parser context and prefers
 * keyword tokens over terminals, so a *value* that happens to equal a field name or a type
 * literal (`{"name": "x"}`, `{"name": "Class"}`) is lexed as that keyword and the parse fails.
 * Keys and values are distinguishable by their surroundings though: a key is always followed by
 * `:`, a value always preceded by `<its key>:`. Recording those positions lets us restrict each
 * keyword's pattern to the position it was declared in, so that everywhere else the value is
 * lexed as a plain `LANGIUM_ID` and any name becomes legal again.
 */
interface KeywordPosition {
    /** The keyword is used as a JSON field name (it is followed by `:`). */
    asKey: boolean;
    /** JSON field names (quoted, e.g. `"__type"`) this keyword is used as a value of. */
    valueOfKeys: Set<string>;
    /** `true` if the keyword appears inside the quotes of a string value, e.g. `"visibility": "PUBLIC"`. */
    quotedValue: boolean;
    /** The keyword also occurs somewhere that is neither a key nor a value - do not touch it then. */
    otherPosition: boolean;
}

/** Keywords that carry a name: `"__type"`, `PUBLIC`, ... - as opposed to JSON punctuation. */
const NAMED_KEYWORD = /^"?[\w*-]+"?$/;

/**
 * Makes the lexer position-aware for the keywords of the JSON-shaped syntax, so that element
 * names may collide with field names and type literals (see {@link KeywordPosition}).
 */
export class UmlDiagramTokenBuilder extends DefaultTokenBuilder {
    protected keywordPositions = new Map<string, KeywordPosition>();

    override buildTokens(grammar: Grammar, options?: TokenBuilderOptions): TokenVocabulary {
        this.keywordPositions = collectKeywordPositions(grammar);
        return super.buildTokens(grammar, options);
    }

    protected override buildKeywordToken(
        keyword: GrammarAST.Keyword,
        terminalTokens: TokenType[],
        caseInsensitive: boolean
    ): TokenType {
        const token = super.buildKeywordToken(keyword, terminalTokens, caseInsensitive);
        const pattern = this.buildPositionalPattern(keyword.value);
        if (pattern) {
            token.PATTERN = pattern;
            // The lookarounds match no input themselves, hence no keyword can span a line break.
            // Both hints are only there to keep Chevrotain from analysing the lookarounds.
            token.LINE_BREAKS = false;
            token.START_CHARS_HINT = [keyword.value.charAt(0)];
        }
        return token;
    }

    protected override buildTerminalToken(terminal: GrammarAST.TerminalRule): TokenType {
        const token = super.buildTerminalToken(terminal);
        if (terminal.name === 'LANGIUM_BOOL') {
            // Booleans are never quoted in this syntax, so `"true"` is a legal name.
            token.PATTERN = /(?<!")(?:true|false)/;
            token.LINE_BREAKS = false;
            token.START_CHARS_HINT = ['t', 'f'];
        }
        return token;
    }

    /**
     * Restricts a keyword to the position it is declared in, or returns `undefined` to keep the
     * keyword's default pattern - which is the case for JSON punctuation and for keywords that
     * are used in more than one position.
     */
    protected buildPositionalPattern(keyword: string): RegExp | undefined {
        const position = this.keywordPositions.get(keyword);
        if (!position || position.otherPosition || !NAMED_KEYWORD.test(keyword)) {
            return undefined;
        }
        const escaped = RegExpUtils.escapeRegExp(keyword);
        if (position.asKey && position.valueOfKeys.size === 0) {
            return new RegExp(`${escaped}(?=\\s*:)`);
        }
        if (!position.asKey && position.valueOfKeys.size > 0) {
            const keys = [...position.valueOfKeys].map(RegExpUtils.escapeRegExp).join('|');
            return new RegExp(`(?<=(?:${keys})\\s*:\\s*${position.quotedValue ? '"' : ''})${escaped}`);
        }
        return undefined;
    }
}

/** Collects the positions every keyword of the grammar is used in. */
function collectKeywordPositions(grammar: Grammar): Map<string, KeywordPosition> {
    const positions = new Map<string, KeywordPosition>();
    const positionOf = (keyword: string): KeywordPosition => {
        let position = positions.get(keyword);
        if (!position) {
            position = { asKey: false, valueOfKeys: new Set(), quotedValue: false, otherPosition: false };
            positions.set(keyword, position);
        }
        return position;
    };
    const markValue = (keyword: string, key: string, quoted: boolean): void => {
        const position = positionOf(keyword);
        position.valueOfKeys.add(key);
        position.quotedValue ||= quoted;
    };

    for (const group of AstUtils.streamAllContents(grammar).filter(GrammarAST.isGroup)) {
        const elements = group.elements;
        for (let index = 0; index < elements.length; index++) {
            const keyword = elements[index];
            if (!GrammarAST.isKeyword(keyword) || isPunctuation(keyword.value)) {
                continue;
            }
            const next = elements[index + 1];
            if (GrammarAST.isKeyword(next) && next.value === ':') {
                positionOf(keyword.value).asKey = true;
                continue;
            }
            // A value either follows its key directly (`"__type": "Class"`) or sits inside the
            // quotes of a string value (`"diagramType": "CLASS"`).
            const quoted = isQuote(elements[index - 1]);
            const key = keyOf(elements, quoted ? index - 2 : index - 1);
            if (key) {
                markValue(keyword.value, key, quoted);
            } else {
                positionOf(keyword.value).otherPosition = true;
            }
        }
        // Keywords assigned as a string value belong to that value's key as well - either
        // directly (`"diagramType": "PACKAGE"`) or through a rule of keyword alternatives
        // (`"visibility": "PACKAGE"`, assigned from the `Visibility` rule).
        for (let index = 0; index < elements.length; index++) {
            const assignment = elements[index];
            if (!GrammarAST.isAssignment(assignment) || !isQuote(elements[index - 1])) {
                continue;
            }
            const key = keyOf(elements, index - 2);
            if (!key) {
                continue;
            }
            const rule = GrammarAST.isRuleCall(assignment.terminal) ? assignment.terminal.rule.ref : undefined;
            const assigned = GrammarAST.isParserRule(rule) ? AstUtils.streamAllContents(rule) : AstUtils.streamAllContents(assignment);
            for (const keyword of assigned.filter(GrammarAST.isKeyword)) {
                markValue(keyword.value, key, true);
            }
        }
    }
    return positions;
}

/** Returns the field name of the `<key> ':'` pair whose colon sits at `elements[index]`, if any. */
function keyOf(elements: GrammarAST.AbstractElement[], index: number): string | undefined {
    const colon = elements[index];
    const key = elements[index - 1];
    if (GrammarAST.isKeyword(colon) && colon.value === ':' && GrammarAST.isKeyword(key) && key.value !== ':') {
        return key.value;
    }
    return undefined;
}

function isQuote(element: GrammarAST.AbstractElement | undefined): boolean {
    return GrammarAST.isKeyword(element) && element.value === '"';
}

function isPunctuation(keyword: string): boolean {
    return !NAMED_KEYWORD.test(keyword);
}
