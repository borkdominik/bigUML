/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import ts, { SyntaxKind } from 'typescript';
import { type Declaration, Multiplicity, type Property } from '../types/index.js';
import { visitPropertyDeclaration } from './property-parser.js';

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

export const visitClassDeclaration = (target: Declaration) => (node: ts.Node) => {
    if (ts.isIdentifier(node)) {
        target.name = node.text;
    } else if (ts.isPropertyDeclaration(node)) {
        const property: Property = {
            name: '',
            isOptional: false,
            decorators: [],
            types: [],
            multiplicity: Multiplicity.ONE_TO_ONE,
            defaultValue: undefined
        };
        if (node.initializer) {
            const init = node.initializer;
            let dv: any;
            if (ts.isStringLiteral(init)) {
                dv = init.text;
            } else if (ts.isNumericLiteral(init)) {
                dv = Number(init.text);
            } else if (init.kind === SyntaxKind.TrueKeyword) {
                dv = true;
            } else if (init.kind === SyntaxKind.FalseKeyword) {
                dv = false;
            } else if (ts.isObjectLiteralExpression(init)) {
                dv = {};
                init.properties.forEach(p => {
                    if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name)) {
                        const key = p.name.text;
                        const valNode = p.initializer;
                        if (ts.isStringLiteral(valNode)) dv[key] = valNode.text;
                        else if (ts.isNumericLiteral(valNode)) dv[key] = Number(valNode.text);
                        else if (valNode.kind === SyntaxKind.TrueKeyword) dv[key] = true;
                        else if (valNode.kind === SyntaxKind.FalseKeyword) dv[key] = false;
                        else dv[key] = valNode.getText();
                    }
                });
            } else {
                dv = init.getText();
            }
            property.defaultValue = dv;
        }
        target.properties!.push(property);
        ts.forEachChild(node, visitPropertyDeclaration(property));
    } else if (ts.isHeritageClause(node)) {
        ts.forEachChild(node, child => {
            if (ts.isExpressionWithTypeArguments(child)) {
                ts.forEachChild(child, expr => {
                    if (ts.isIdentifier(expr)) {
                        const name = expr.getText();
                        if (name !== 'ABSTRACT_ELEMENT' && name !== 'ROOT_ELEMENT') {
                            target.extends!.push(name);
                        }
                    }
                });
            }
        });
    } else if (node.kind === SyntaxKind.AbstractKeyword) {
        target.isAbstract = true;
    } else if (ts.isDecorator(node)) {
        const expr = node.expression;
        if (ts.isCallExpression(expr)) {
            const decoratorName = expr.expression.getText();
            const args = expr.arguments.map(arg => serializeDecoratorArg(arg));
            target.decorators!.push(`${decoratorName}:${args.join(',')}`);
        } else if (ts.isIdentifier(expr)) {
            target.decorators!.push(expr.getText());
        }
    }
};
