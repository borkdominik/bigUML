/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Class, type DataType, type Property } from '@borkdominik-biguml/model-server/grammar';
import { ArrayMaxSize, Matches, MinLength, ValidateIf } from 'class-validator';

export class ClassValidationElement {
    constructor(src: Class) {
        Object.assign(this, src);
    }

    @Matches(/^[A-Z]/, {
        message: 'First letter of class name must be uppercase.'
    })
    @MinLength(5, { message: 'Class name must be at least 5 characters long' })
    name: string;
    @ValidateIf(o => o.isActive === true)
    @ArrayMaxSize(3, {
        message: 'Active classes must declare at most 3 properties.'
    })
    properties?: Array<Property>;
    isActive?: boolean;
}

export class DataTypeValidationElement {
    constructor(src: DataType) {
        Object.assign(this, src);
    }

    @MinLength(5)
    name: string;
}
