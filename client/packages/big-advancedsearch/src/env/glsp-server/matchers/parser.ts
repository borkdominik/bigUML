/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { CstParser } from 'chevrotain';
import {
    allTokens,
    AttributeKeyword,
    BooleanLiteral,
    ClassKeyword,
    Comma,
    DataTypeKeyword,
    EnumerationKeyword,
    EnumerationLiteralKeyword,
    Equals,
    GreaterThan,
    Identifier,
    InstanceSpecificationKeyword,
    IntegerLiteral,
    InterfaceKeyword,
    LeftSquareBracket,
    MethodKeyword,
    PackageKeyword,
    ParameterKeyword,
    PrimitiveTypeKeyword,
    RelationshipKeyword,
    RightSquareBracket,
    Similar,
    SlotKeyword,
    StringLiteral,
    tokenize
} from './lexer.js';

export class ModelParser extends CstParser {
    constructor(options?: any) {
        super(allTokens, options);
        this.performSelfAnalysis();
    }

    public expression = this.RULE('expression', () => {
        this.SUBRULE(this.searchElement);
    });

    public searchElement = this.RULE('searchElement', () => {
        this.SUBRULE(this.elementType);

        this.OPTION(() => {
            this.SUBRULE(this.filterList);
        });

        this.MANY(() => {
            this.CONSUME(GreaterThan);
            this.SUBRULE2(this.searchElement);
        });
    });

    public elementType = this.RULE('elementType', () => {
        this.OR([
            { ALT: () => this.CONSUME(ClassKeyword) },
            { ALT: () => this.CONSUME(AttributeKeyword) },
            { ALT: () => this.CONSUME(MethodKeyword) },
            { ALT: () => this.CONSUME(RelationshipKeyword) },
            { ALT: () => this.CONSUME(DataTypeKeyword) },
            { ALT: () => this.CONSUME(EnumerationKeyword) },
            { ALT: () => this.CONSUME(EnumerationLiteralKeyword) },
            { ALT: () => this.CONSUME(InterfaceKeyword) },
            { ALT: () => this.CONSUME(PrimitiveTypeKeyword) },
            { ALT: () => this.CONSUME(PackageKeyword) },
            { ALT: () => this.CONSUME(InstanceSpecificationKeyword) },
            { ALT: () => this.CONSUME(SlotKeyword) },
            { ALT: () => this.CONSUME(ParameterKeyword) },
        ]);
    });

    public filterList = this.RULE('filterList', () => {
        this.CONSUME(LeftSquareBracket);

        this.OPTION(() => {
            this.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    this.SUBRULE(this.filter);
                }
            });
        });

        this.CONSUME(RightSquareBracket);
    });

    public filter = this.RULE('filter', () => {
        this.CONSUME(Identifier, { LABEL: 'key' });
        this.SUBRULE(this.operator);
        this.SUBRULE(this.value);
    });

    public operator = this.RULE('operator', () => {
        this.OR([{ ALT: () => this.CONSUME(Equals) }, { ALT: () => this.CONSUME(Similar) }]);
    });

    public value = this.RULE('value', () => {
        this.OR([
            { ALT: () => this.CONSUME(StringLiteral) },
            { ALT: () => this.CONSUME(BooleanLiteral) },
            { ALT: () => this.CONSUME(IntegerLiteral) },
            { ALT: () => this.CONSUME(Identifier) },
            { ALT: () => this.SUBRULE(this.searchElement) }
        ]);
    });
}

export const parser = new ModelParser();

export function parse(text: string) {
    parser.input = tokenize(text);
    const cst = parser.expression();

    if (parser.errors.length > 0) {
        const msg = parser.errors.map(error => `[${error.name}] ${error.message}`).join(', ');

        throw new Error(msg);
    }

    return cst;
}
