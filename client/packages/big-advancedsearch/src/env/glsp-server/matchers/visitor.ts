/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { parse, parser } from './parser.js';
import type { SearchCriteria, SearchElementType, SearchFilter, SearchOperator, SearchValue } from './search-ast.js';
import { findFilterSpec } from './search-schema.js';

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

class ModelAstBuilderVisitor extends BaseCstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    expression(children: any): SearchCriteria {
        return this.visit(children.searchElement);
    }

    searchElement(children: any): SearchCriteria {
        const type = this.visit(children.elementType) as SearchElementType;

        const criteria: SearchCriteria = {
            type,
            filters: [],
            children: []
        };

        if (children.filterList) {
            criteria.filters = this.visit(children.filterList);
        }

        if (children.searchElement) {
            criteria.children = children.searchElement.map((child: any) => this.visit(child));
        }

        this.validateFilters(criteria);

        return criteria;
    }

    elementType(children: any): SearchElementType {
        if (children.ClassKeyword) return 'Class';
        if (children.AttributeKeyword) return 'Attribute';
        if (children.MethodKeyword) return 'Method';
        if (children.RelationshipKeyword) return 'Relationship';
        if (children.DataTypeKeyword) return 'DataType';
        if (children.EnumerationKeyword) return 'Enumeration';
        if (children.EnumerationLiteralKeyword) return 'EnumerationLiteral';
        if (children.InterfaceKeyword) return 'Interface';
        if (children.PrimitiveTypeKeyword) return 'PrimitiveType';
        if (children.PackageKeyword) return 'Package';
        if (children.InstanceSpecificationKeyword) return 'InstanceSpecification';
        if (children.SlotKeyword) return 'Slot';
        if (children.ParameterKeyword) return 'Parameter';

        throw new Error('Unknown search element type.');
    }

    filterList(children: any): SearchFilter[] {
        if (!children.filter) {
            return [];
        }

        return children.filter.map((filterCst: any) => this.visit(filterCst));
    }

    filter(children: any): SearchFilter {
        const key = children.key[0].image;
        const operator = this.visit(children.operator) as SearchOperator;
        const value = this.visit(children.value) as SearchValue;

        return {
            key,
            operator,
            value
        };
    }

    operator(children: any): SearchOperator {
        if (children.Equals) return 'equals';
        if (children.Similar) return 'contains';

        throw new Error('Unknown operator.');
    }

    value(children: any): SearchValue {
        const token =
            children.StringLiteral?.[0] ??
            children.BooleanLiteral?.[0] ??
            children.IntegerLiteral?.[0] ??
            children.Identifier?.[0] ??
            children.searchElement?.[0];        

        if (children.searchElement) {
            return {
                type: 'criteria',
                value: this.visit(children.searchElement[0]) as SearchCriteria
            };
        }

        if (!token) {
            throw new Error('Missing value.');
        }

        if (children.StringLiteral) {
            return {
                type: 'string',
                value: this.unquote(token.image)
            };
        }

        if (children.BooleanLiteral) {
            return {
                type: 'boolean',
                value: token.image.toLowerCase() === 'true'
            };
        }

        if (children.IntegerLiteral) {
            return {
                type: 'number',
                value: Number(token.image)
            };
        }

        return {
            type: 'string',
            value: token.image
        };
    }

    private validateFilters(criteria: SearchCriteria): void {
        for (const filter of criteria.filters) {
            if (filter.value.type === 'criteria') continue;

            const spec = findFilterSpec(criteria.type, filter.key);

            if (!spec) {
                throw new Error(`Filter "${filter.key}" is not supported on ${criteria.type}.`);
            }

            if (filter.value.type !== spec.valueType) {
                throw new Error(`Filter "${filter.key}" on ${criteria.type} expects ${spec.valueType}, but got ${filter.value.type}.`);
            }
        }

        for (const child of criteria.children) {
            this.validateFilters(child);
        }
    }

    private unquote(value: string): string {
        return value.slice(1, -1).replace(/\\"/g, '"');
    }
}

const astBuilder = new ModelAstBuilderVisitor();

export function buildAst(text: string): SearchCriteria {
    const cst = parse(text);
    return astBuilder.visit(cst) as SearchCriteria;
}
