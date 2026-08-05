// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ArrayMaxSize, MinLength, ValidateIf } from 'class-validator';
import { Class, DataType, Property } from '../langium/language/ast.js';

export class DataTypeValidationElement {
    constructor(src: DataType) {
        Object.assign(this, src);
    }

    @MinLength(1) name: string;
}

export class ClassValidationElement {
    constructor(src: Class) {
        Object.assign(this, src);
    }

    @MinLength(1, { message: 'Class name must be at least 1 characters long' })
    name: string;
    @ValidateIf(o => o.isActive === true)
    @ArrayMaxSize(3, {
        message: 'Active classes must declare at most 3 properties.'
    })
    properties?: Array<Property>;
    isActive?: boolean;
}
