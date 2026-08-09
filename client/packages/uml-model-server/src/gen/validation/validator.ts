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
import { isClass, isDataType } from '../langium/language/ast.js';
import { ClassValidationElement, DataTypeValidationElement } from './validation-elements.js';

export function validateNode(node: AstNode): void {
    let errors: any[] = [];

    if (isClass(node)) {
        errors = validateSync(new ClassValidationElement(node));
    }

    if (isDataType(node)) {
        errors = validateSync(new DataTypeValidationElement(node));
    }

    if (errors.length) {
        const msg = errors.flatMap(e => Object.values(e.constraints ?? {})).join(', ');
        throw new Error('Validation error: ' + msg);
    }
}
