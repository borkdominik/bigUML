// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { validateSync } from 'class-validator';
import type { AstNode } from 'langium';
import { isGenericEdge, isAssociation, isProperty, isParameter, isDataType, isClass } from '../langium/language/ast.js';
import {
    GenericEdgeValidationElement,
    AssociationValidationElement,
    PropertyValidationElement,
    ParameterValidationElement,
    DataTypeValidationElement,
    ClassValidationElement
} from './validation-elements.js';

export function validateNode(node: AstNode): void {
    let errors: any[] = [];

    if (isGenericEdge(node)) {
        errors = validateSync(new GenericEdgeValidationElement(node));
    }

    if (isAssociation(node)) {
        errors = validateSync(new AssociationValidationElement(node));
    }

    if (isProperty(node)) {
        errors = validateSync(new PropertyValidationElement(node));
    }

    if (isParameter(node)) {
        errors = validateSync(new ParameterValidationElement(node));
    }

    if (isDataType(node)) {
        errors = validateSync(new DataTypeValidationElement(node));
    }

    if (isClass(node)) {
        errors = validateSync(new ClassValidationElement(node));
    }

    if (errors.length) {
        const msg = errors.flatMap(e => Object.values(e.constraints ?? {})).join(', ');
        throw new Error('Validation error: ' + msg);
    }
}
