import { validateSync } from 'class-validator';
import type { AstNode } from 'langium';
import {} from '../../generated/ast.js';
import {} from './validation-elements.js';

export function validateNode(node: AstNode): void {
  let errors = [];

  if (errors.length) {
    const msg = errors
      .flatMap((e) => Object.values(e.constraints ?? {}))
      .join(', ');
    throw new Error('Validation error: ' + msg);
  }
}
