/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import ts, { SyntaxKind } from 'typescript';
import { Multiplicity, type Property } from '../types/index.js';
import { visitTypeReferenceNode } from './type-reference-parser.js';
import { visitUnionType } from './union-parser.js';

function serializeDecoratorArg(arg: ts.Expression): string {
    if (ts.isStringLiteral(arg)) {
        return arg.text;
    }
    if (ts.isObjectLiteralExpression(arg)) {
        const obj: Record<string, unknown> = {};
        for (const prop of arg.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                const key = prop.name.text;
                const val = prop.initializer;
                if (ts.isStringLiteral(val)) {
                    obj[key] = val.text;
                } else if (ts.isNumericLiteral(val)) {
                    obj[key] = Number(val.text);
                } else if (val.kind === SyntaxKind.TrueKeyword) {
                    obj[key] = true;
                } else if (val.kind === SyntaxKind.FalseKeyword) {
                    obj[key] = false;
                } else {
                    obj[key] = val.getText();
                }
            }
        }
        return JSON.stringify(obj);
    }
    return arg.getText();
}

export const visitPropertyDeclaration = (target: Property) => (node: ts.Node) => {
    if (ts.isIdentifier(node)) {
        target.name = node.text;
    } else if (ts.isDecorator(node)) {
        const expr = node.expression;
        if (ts.isCallExpression(expr)) {
            const decoratorName = expr.expression.getText();
            if (expr.arguments.length > 0) {
                const args = expr.arguments.map(arg => serializeDecoratorArg(arg));
                target.decorators.push(`${decoratorName}:${args.join(',')}`);
            } else {
                target.decorators.push(decoratorName);
            }
        } else if (ts.isIdentifier(expr)) {
            // For simple decorators without arguments (e.g., @path, @crossReference)
            target.decorators.push(expr.getText());
        }
    } else if (ts.isTypeReferenceNode(node)) {
        ts.forEachChild(node, visitTypeReferenceNode(target));
    } else if (ts.isUnionTypeNode(node)) {
        ts.forEachChild(node, visitUnionType(target));
    } else if (
        node.kind === SyntaxKind.NumberKeyword ||
        node.kind === SyntaxKind.BooleanKeyword ||
        node.kind === SyntaxKind.StringKeyword
    ) {
        target.types.push({ type: 'simple', typeName: node.getText() });
    } else if (ts.isLiteralTypeNode(node)) {
        ts.forEachChild(node, child => {
            if (
                ts.isStringLiteral(child) ||
                ts.isNumericLiteral(child) ||
                child.kind === ts.SyntaxKind.TrueKeyword ||
                child.kind === ts.SyntaxKind.FalseKeyword
            ) {
                const text = child.getText().replace(/'/g, '');
                target.types.push({
                    type: 'constant',
                    typeName: JSON.stringify(text)
                });
            }
        });
    } else if (ts.isQuestionToken(node)) {
        target.isOptional = true;
    } else if (ts.isArrayTypeNode(node)) {
        target.multiplicity = target.isOptional ? Multiplicity.ZERO_TO_N : Multiplicity.ONE_TO_N;
        ts.forEachChild(node, visitPropertyDeclaration(target));
    }
};
