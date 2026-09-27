/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { createToken, Lexer } from 'chevrotain';

export const Identifier = createToken({
    name: 'Identifier',
    pattern: /[a-zA-Z_]\w*/
});
export const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    line_breaks: true,
    group: Lexer.SKIPPED
});

export const ClassKeyword = createToken({
    name: 'ClassKeyword',
    pattern: /Class/i
});

export const AttributeKeyword = createToken({
    name: 'AttributeKeyword',
    pattern: /Attribute/i
});

export const MethodKeyword = createToken({
    name: 'MethodKeyword',
    pattern: /Method/i
});

export const DataTypeKeyword = createToken({
    name: 'DataTypeKeyword',
    pattern: /DataType/i
});

export const RelationshipKeyword = createToken({
    name: 'RelationshipKeyword',
    pattern: /Relationship|Relation/i,
    longer_alt: Identifier
});

export const EnumerationLiteralKeyword = createToken({
    name: 'EnumerationLiteralKeyword',
    pattern: /EnumerationLiteral/i
});

export const EnumerationKeyword = createToken({
    name: 'EnumerationKeyword',
    pattern: /Enumeration/i
});

export const InterfaceKeyword = createToken({
    name: 'InterfaceKeyword',
    pattern: /Interface/i
});

export const PrimitiveTypeKeyword = createToken({
    name: 'PrimitiveTypeKeyword',
    pattern: /PrimitiveType/i
});

export const PackageKeyword = createToken({
    name: 'PackageKeyword',
    pattern: /Package/i
});

export const InstanceSpecificationKeyword = createToken({
    name: 'InstanceSpecificationKeyword',
    pattern: /InstanceSpecification|Instance/i,
    longer_alt: Identifier
});

export const SlotKeyword = createToken({
    name: 'SlotKeyword',
    pattern: /Slot/i
});

export const BooleanLiteral = createToken({
    name: 'BooleanLiteral',
    pattern: /true|false/i,
    longer_alt: Identifier
});

export const IntegerLiteral = createToken({
    name: 'IntegerLiteral',
    pattern: /\d+/
});

export const StringLiteral = createToken({
    name: 'StringLiteral',
    pattern: /"([^"\\]|\\.)*"/
});

export const LeftSquareBracket = createToken({
    name: 'LeftSquareBracket',
    pattern: /\[/
});

export const RightSquareBracket = createToken({
    name: 'RightSquareBracket',
    pattern: /\]/
});

export const Comma = createToken({
    name: 'Comma',
    pattern: /,/
});

export const GreaterThan = createToken({
    name: 'GreaterThan',
    pattern: />/
});

export const Equals = createToken({
    name: 'Equals',
    pattern: /=/
});

export const Similar = createToken({
    name: 'Similar',
    pattern: /~/
});

export const ParameterKeyword = createToken({
    name: 'ParameterKeyword',
    pattern: /Parameter/i,
    longer_alt: Identifier
});

export const allTokens = [
    WhiteSpace,

    ClassKeyword,
    AttributeKeyword,
    MethodKeyword,
    RelationshipKeyword,
    DataTypeKeyword,
    EnumerationLiteralKeyword,
    EnumerationKeyword,
    InterfaceKeyword,
    PrimitiveTypeKeyword,
    PackageKeyword,
    InstanceSpecificationKeyword,
    SlotKeyword,
    ParameterKeyword,

    BooleanLiteral,
    IntegerLiteral,
    StringLiteral,
    Identifier,

    LeftSquareBracket,
    RightSquareBracket,
    Comma,
    GreaterThan,
    Equals,
    Similar
];

export const ModelLexer = new Lexer(allTokens);

export function tokenize(text: string) {
    const result = ModelLexer.tokenize(text);

    if (result.errors.length > 0) {
        const msg = result.errors.map(error => `[${error.line}:${error.column}] ${error.message}`).join(', ');

        throw new Error(`Error tokenizing the text. ${msg}`);
    }

    return result.tokens;
}
