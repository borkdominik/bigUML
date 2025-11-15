import { validateSync } from 'class-validator';
import type { AstNode } from 'langium';
import {
  isEnumeration,
  isClass,
  isInterface,
  isDataType,
} from '../../generated/ast.js';
import {
  EnumerationValidationElement,
  ClassValidationElement,
  InterfaceValidationElement,
  DataTypeValidationElement,
} from './validation-elements.js';

export function validateNode(node: AstNode): void {
  let errors = [];
  if (isEnumeration(node)) {
    errors = validateSync(new EnumerationValidationElement(node));
  }
  if (isClass(node)) {
    errors = validateSync(new ClassValidationElement(node));
  }
  if (isInterface(node)) {
    errors = validateSync(new InterfaceValidationElement(node));
  }
  if (isDataType(node)) {
    errors = validateSync(new DataTypeValidationElement(node));
  }

  if (errors.length) {
    const msg = errors
      .flatMap((e) => Object.values(e.constraints ?? {}))
      .join(', ');
    throw new Error('Validation error: ' + msg);
  }
}
