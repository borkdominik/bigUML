/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isStorableMultiplicity, MULTIPLICITY_FORMAT_MESSAGE } from '@borkdominik-biguml/uml-language-tooling/values';
import { registerDecorator, type ValidationOptions, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';

/**
 * A multiplicity, or none. Put on the generated validation elements for every property the definition
 * marks `@Language.multiplicity` - it is not written in a definition itself.
 */
@ValidatorConstraint({ name: 'isMultiplicity', async: false })
export class IsMultiplicityConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        return isStorableMultiplicity(value);
    }

    defaultMessage(): string {
        return MULTIPLICITY_FORMAT_MESSAGE;
    }
}

export function IsMultiplicity(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsMultiplicityConstraint
        });
    };
}
