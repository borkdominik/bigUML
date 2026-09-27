// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { MinLength } from 'class-validator';
import { IsMultiplicity } from '../../env/validators/index.js';
import { Association, Class, DataType, GenericEdge, Parameter, Property } from '../langium/language/ast.js';

export class GenericEdgeValidationElement {
    constructor(src: GenericEdge) {
        Object.assign(this, src);
    }

    @IsMultiplicity() sourceMultiplicity?: string;
    @IsMultiplicity() targetMultiplicity?: string;
}

export class AssociationValidationElement {
    constructor(src: Association) {
        Object.assign(this, src);
    }

    @IsMultiplicity() sourceMultiplicity?: string;
    @IsMultiplicity() targetMultiplicity?: string;
}

export class PropertyValidationElement {
    constructor(src: Property) {
        Object.assign(this, src);
    }

    @IsMultiplicity() multiplicity?: string;
}

export class ParameterValidationElement {
    constructor(src: Parameter) {
        Object.assign(this, src);
    }

    @IsMultiplicity() multiplicity?: string;
}

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

    @MinLength(1, { message: 'Class name must be at least 1 characters long' }) name: string;
}
