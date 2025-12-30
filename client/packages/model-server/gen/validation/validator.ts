import { isClass, isDataType } from '@borkdominik-biguml/model-server/grammar';
import { validateSync } from 'class-validator';
import type { AstNode } from 'langium';
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
