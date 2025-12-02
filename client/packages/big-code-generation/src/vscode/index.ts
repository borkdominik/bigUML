/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export * from './code-generation.module.js';
export * from './code-generation.provider.js';

import { getUMLObjectType, type UMLOwnedParameter } from '@borkdominik-biguml/uml-protocol';
import Handlebars from 'handlebars';

Handlebars.registerHelper('isdefined', function (value) {
    return value !== undefined;
});

Handlebars.registerHelper('isClass', function (value) {
    if (!value || typeof value.eClass !== 'string') {
        throw new TypeError('Expected `this.eClass` to be a string');
    }
    return getUMLObjectType(value) === 'Class';
});

Handlebars.registerHelper('isInterface', function (value) {
    if (!value || typeof value.eClass !== 'string') {
        throw new TypeError('Expected `this.eClass` to be a string');
    }
    return getUMLObjectType(value) === 'Interface';
});

Handlebars.registerHelper('isEnumeration', function (value) {
    if (!value || typeof value.eClass !== 'string') {
        throw new TypeError('Expected `this.eClass` to be a string');
    }
    return getUMLObjectType(value) === 'Enumeration';
});

Handlebars.registerHelper('isPackagePrivateModifier', function (value) {
    if (!value) {
        return true;
    }
    if (typeof value !== 'string') {
        throw new TypeError('Expected `this` to be a string');
    }
    return value === 'package';
});

Handlebars.registerHelper('returnType', function (parameters: UMLOwnedParameter[]) {
    for (const parameter of parameters) {
        if (parameter.direction === 'return') {
            const tmp = parameter.type as any;
            return tmp.name;
        }
    }

    return 'void';
});

Handlebars.registerHelper('parameters', function (parameters: UMLOwnedParameter[]) {
    return parameters.filter(parameter => parameter.direction !== 'return');
});
