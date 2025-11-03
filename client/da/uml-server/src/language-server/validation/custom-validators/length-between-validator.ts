import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'lengthBetween', async: false })
export class LengthBetweenConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const [min, max] = args.constraints as [number, number];
        return typeof value === 'string' && value.length >= min && value.length <= max;
    }

    defaultMessage(args: ValidationArguments): string {
        const [min, max] = args.constraints as [number, number];
        return `${args.property} must be between ${min} and ${max} characters long`;
    }
}

export function LengthBetween(min: number, max: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            constraints: [min, max],
            options: validationOptions,
            validator: LengthBetweenConstraint
        });
    };
}
