/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

// Reminder, this file is a placeholder for the future server model state.
// You may customize it as needed.
// It doesn't have all information yet, but it will be improved in the future.
// It is only used for type safety.
// Check the structure exposed by the ModelState class + read the documentation

export interface UMLIdentifer {
    id: string;
}

export namespace UMLIdentifier {
    export function is(value: NonNullable<unknown>): value is UMLEObject {
        return 'id' in value;
    }
}

export interface UMLEObject extends UMLIdentifer {
    eClass: string;
}

export namespace UMLEObject {
    export function is(value: NonNullable<unknown>): value is UMLEObject {
        return UMLIdentifier.is(value) && 'eClass' in value;
    }
}

export interface UMLSourceModel extends UMLEObject {
    packagedElement?: UMLPackagedElement[];
}

export namespace UMLSourceModel {
    export function is(value: NonNullable<unknown>): value is UMLSourceModel {
        return UMLEObject.is(value) && 'packagedElement' in value && Array.isArray((value as any).packagedElement);
    }
}

export type UMLPackagedElement = UMLEObject;

export interface UMLClass extends UMLPackagedElement {
    name: string;
    ownedAttribute?: UMLOwnedAttribute[];
    ownedOperation?: UMLOwnedOperation[];
    interfaceRealization?: UMLInterfaceRealization[];
}

export namespace UMLClass {
    export function is(value: NonNullable<unknown>): value is UMLClass {
        return UMLEObject.is(value) && value.eClass === 'http://www.eclipse.org/uml2/5.0.0/UML#//Class';
    }
}

export interface UMLInterface extends UMLPackagedElement {
    name: string;
    ownedOperation?: UMLOwnedOperation[];
}

export namespace UMLInterface {
    export function is(value: NonNullable<unknown>): value is UMLInterface {
        return UMLEObject.is(value) && value.eClass === 'http://www.eclipse.org/uml2/5.0.0/UML#//Interface';
    }
}

export interface UMLEnumeration extends UMLPackagedElement {
    name: string;
    ownedLiteral?: UMLEnumerationLiteral[];
}

export namespace UMLEnumeration {
    export function is(value: NonNullable<unknown>): value is UMLEnumeration {
        return UMLEObject.is(value) && value.eClass === 'http://www.eclipse.org/uml2/5.0.0/UML#//Enumeration';
    }
}

export interface UMLPrimitiveType extends UMLPackagedElement {
    name: string;
    ownedOperation?: UMLOwnedOperation[];
}

export namespace UMLPrimitiveType {
    export function is(value: NonNullable<unknown>): value is UMLPrimitiveType {
        return UMLEObject.is(value) && value.eClass === 'http://www.eclipse.org/uml2/5.0.0/UML#//PrimitiveType';
    }
}

export interface UMLEnumerationLiteral {
    name: string;
    visibility?: string;
    classifier?: UMLEObjectReference[];
}

export namespace UMLEnumerationLiteral {
    export function is(value: NonNullable<unknown>): value is UMLEnumerationLiteral {
        return 'name' in value && 'classifier' in value;
    }
}

export interface UMLOwnedAttribute {
    name: string;
    visibility?: string;
    type?: UMLEObjectReference;
    lowerValue?: UMLLiteralInteger;
    upperValue?: UMLLiteralUnlimitedNatural;
}

export namespace UMLOwnedAttribute {
    export function is(value: NonNullable<unknown>): value is UMLOwnedAttribute {
        return 'name' in value && 'type' in value;
    }
}

export interface UMLOwnedOperation {
    name: string;
    ownedParameter?: UMLOwnedParameter[];
}

export namespace UMLOwnedOperation {
    export function is(value: NonNullable<unknown>): value is UMLOwnedOperation {
        return 'name' in value && 'ownedParameter' in value;
    }
}

export interface UMLOwnedParameter {
    name: string;
    type?: UMLEObjectReference;
    direction?: string;
}

export namespace UMLOwnedParameter {
    export function is(value: NonNullable<unknown>): value is UMLOwnedParameter {
        return 'name' in value && 'type' in value;
    }
}

export interface UMLEObjectReference {
    eClass: string;
    $ref: string;
}

export namespace UMLEObjectReference {
    export function is(value: NonNullable<unknown>): value is UMLEObjectReference {
        return 'eClass' in value && '$ref' in value;
    }
}

export interface UMLLiteralInteger {
    value: number;
}

export namespace UMLLiteralInteger {
    export function is(value: NonNullable<unknown>): value is UMLLiteralInteger {
        return 'value' in value && typeof (value as any).value === 'number';
    }
}

export interface UMLLiteralUnlimitedNatural {
    value: number;
}

export namespace UMLLiteralUnlimitedNatural {
    export function is(value: NonNullable<unknown>): value is UMLLiteralUnlimitedNatural {
        return 'value' in value && typeof (value as any).value === 'number';
    }
}

export interface UMLInterfaceRealization {
    client: UMLEObjectReference[];
    supplier: UMLEObjectReference[];
    contract: UMLEObjectReference;
}

export namespace UMLInterfaceRealization {
    export function is(value: NonNullable<unknown>): value is UMLInterfaceRealization {
        return UMLEObject.is(value) && 'client' in value && 'supplier' in value && 'contract' in value;
    }
}

export interface UMLUsage extends UMLEObject {
    client: UMLEObjectReference[];
    supplier: UMLEObjectReference[];
}

export namespace UMLUsage {
    export function is(value: NonNullable<unknown>): value is UMLUsage {
        return UMLEObject.is(value) && 'client' in value && 'supplier' in value;
    }
}

export function getUMLObjectType(value: NonNullable<unknown>): string | undefined {
    if (UMLClass.is(value)) {
        return 'Class';
    } else if (UMLInterface.is(value)) {
        return 'Interface';
    } else if (UMLEnumeration.is(value)) {
        return 'Enumeration';
    } else if (UMLPrimitiveType.is(value)) {
        return 'PrimitiveType';
    } else if (UMLEnumerationLiteral.is(value)) {
        return 'EnumerationLiteral';
    } else if (UMLOwnedAttribute.is(value)) {
        return 'OwnedAttribute';
    } else if (UMLOwnedOperation.is(value)) {
        return 'OwnedOperation';
    } else if (UMLOwnedParameter.is(value)) {
        return 'OwnedParameter';
    } else if (UMLEObjectReference.is(value)) {
        return 'EObjectReference';
    } else if (UMLLiteralInteger.is(value)) {
        return 'LiteralInteger';
    } else if (UMLLiteralUnlimitedNatural.is(value)) {
        return 'LiteralUnlimitedNatural';
    } else if (UMLInterfaceRealization.is(value)) {
        return 'InterfaceRealization';
    } else if (UMLUsage.is(value)) {
        return 'Usage';
    } else if (UMLSourceModel.is(value)) {
        return 'SourceModel';
    } else if (UMLEObject.is(value)) {
        return 'EObject';
    }
    return undefined;
}
