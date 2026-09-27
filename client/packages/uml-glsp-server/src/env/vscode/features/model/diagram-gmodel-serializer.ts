/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type GModelElement, type GModelElementSchema, DefaultGModelSerializer } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { isAstNode } from 'langium';

@injectable()
export class DiagramGModelSerializer extends DefaultGModelSerializer {
    override createSchema(element: GModelElement): GModelElementSchema {
        const schema: Record<string, any> = {};

        for (const key in element) {
            if (!this.isReserved(element, key)) {
                const value: any = (element as any)[key];

                if (typeof value === 'function') {
                    continue;
                }

                // An AST node handed to the graph as it is - a stored `Bounds` given as a position - goes out
                // as its data only: its `$container` would take the whole model, cycles included, with it.
                schema[key] = isAstNode(value) ? withoutAstProperties(value) : value;
            }
        }

        schema['children'] = (element.children ?? []).map(child => this.createSchema(child));

        return schema as GModelElementSchema;
    }
}

function withoutAstProperties(node: object): Record<string, unknown> {
    return Object.fromEntries(Object.entries(node).filter(([key]) => !key.startsWith('$')));
}
