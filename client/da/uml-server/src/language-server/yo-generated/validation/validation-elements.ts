import { ArrayMaxSize, Matches, MinLength, ValidateIf } from 'class-validator';
import { LengthBetween } from '../../validation/custom-validators/length-between-validator.js';
import {
  Class,
  DataType,
  Enumeration,
  Interface,
  Property,
} from '../../generated/ast.js';

export class EnumerationValidationElement {
  constructor(src: Enumeration) {
    Object.assign(this, src);
  }

  @LengthBetween(3, 10, { message: 'Enumeration.name must be 3–10 characters' })
  name: string;
}

export class ClassValidationElement {
  constructor(src: Class) {
    Object.assign(this, src);
  }

  @Matches(/^[A-Z]/, {
    message: 'First letter of class name must be uppercase.',
  })
  @MinLength(5, { message: 'Class name must be at least 5 characters long' })
  name: string;
  @ValidateIf((o) => o.isActive === true)
  @ArrayMaxSize(3, {
    message: 'Active classes must declare at most 3 properties.',
  })
  properties?: Array<Property>;
  isActive?: boolean;
}

export class InterfaceValidationElement {
  constructor(src: Interface) {
    Object.assign(this, src);
  }

  @LengthBetween(3, 10, { message: 'Interface.name must be 3–10 characters' })
  name: string;
}

export class DataTypeValidationElement {
  constructor(src: DataType) {
    Object.assign(this, src);
  }

  @MinLength(5)
  name: string;
}
