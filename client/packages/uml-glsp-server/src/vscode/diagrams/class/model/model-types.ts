/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { DefaultTypes } from '@eclipse-glsp/server';

// TODO: Haydar

export namespace ModelTypes {
    export const LABEL_HEADING = 'label:heading';
    export const LABEL_NAME = 'label:name';
    export const LABEL_TEXT = 'label:text';
    export const COMP_HEADER = 'comp:header';
    export const LABEL_ICON = 'label:icon';
    export const EDGE = 'edge';
    export const ICON = 'icon';
    export const DIVIDER = 'divider';

    // container types
    export const CLASS = representationTypeId('Class', DefaultTypes.NODE, 'Class');
    export const ABSTRACT_CLASS = representationTypeId('Class', DefaultTypes.NODE, 'AbstractClass'); // class die abstract ist
    export const DATA_TYPE = representationTypeId('Class', DefaultTypes.NODE, 'DataType');
    export const ENUMERATION = representationTypeId('Class', DefaultTypes.NODE, 'Enumeration');
    export const INSTANCE_SPECIFICATION = representationTypeId('Class', DefaultTypes.NODE, 'InstanceSpecification');
    export const INTERFACE = representationTypeId('Class', DefaultTypes.NODE, 'Interface');
    export const PACKAGE = representationTypeId('Class', DefaultTypes.NODE, 'Package');
    export const PRIMITIVE_TYPE = representationTypeId('Class', DefaultTypes.NODE, 'PrimitiveType');
    // feature types
    export const PROPERTY = representationTypeId('Class', DefaultTypes.NODE, 'Property');
    export const OPERATION = representationTypeId('Class', DefaultTypes.NODE, 'Operation');
    export const PARAMETER = representationTypeId('Class', DefaultTypes.NODE, 'Parameter');
    export const ENUMERATION_LITERAL = representationTypeId('Class', DefaultTypes.NODE, 'EnumerationLiteral');
    export const SLOT = representationTypeId('Class', DefaultTypes.NODE, 'Slot');
    export const LITERAL_SPECIFICATION = representationTypeId('Class', DefaultTypes.NODE, 'LiteralSpecification');
    // relation types
    export const ABSTRACTION = representationTypeId('Class', DefaultTypes.EDGE, 'Abstraction');
    export const AGGREGATION = representationTemplateTypeId('Class', DefaultTypes.EDGE, 'aggregation', 'Association');
    export const ASSOCIATION = representationTypeId('Class', DefaultTypes.EDGE, 'Association');
    export const COMPOSITION = representationTemplateTypeId('Class', DefaultTypes.EDGE, 'composition', 'Association');
    export const DEPENDENCY = representationTypeId('Class', DefaultTypes.EDGE, 'Dependency');
    export const GENERALIZATION = representationTypeId('Class', DefaultTypes.EDGE, 'Generalization');
    export const INTERFACE_REALIZATION = representationTypeId('Class', DefaultTypes.EDGE, 'InterfaceRealization');
    export const INHERITANCE = representationTypeId('Class', DefaultTypes.EDGE, 'Inheritance');
    export const PACKAGE_IMPORT = representationTypeId('Class', DefaultTypes.EDGE, 'PackageImport');
    export const PACKAGE_MERGE = representationTypeId('Class', DefaultTypes.EDGE, 'PackageMerge');
    export const REALIZATION = representationTypeId('Class', DefaultTypes.EDGE, 'Realization');
    export const SUBSTITUTION = representationTypeId('Class', DefaultTypes.EDGE, 'Substitution');
    export const USAGE = representationTypeId('Class', DefaultTypes.EDGE, 'Usage');

    export const STRUCTURE = 'struct';

    export const MISSING_NODE = 'missingNode';
}

function representationTypeId(representation: string, _type: string, name: string): string {
    return `${representation.toLowerCase()}__${name}`;
}

function representationTemplateTypeId(representation: string, _type: string, template: string, name: string): string {
    return `${representation.toLowerCase()}__${template}__${name}`;
}

export namespace astTypes {
    export function convertToAst(elementId: string): string {
        if (elementId === ModelTypes.CLASS || elementId === ModelTypes.ABSTRACT_CLASS) {
            return 'Class';
        }
        return stripPrefix(elementId);
    }

    function stripPrefix(name: string): string {
        return name.replace(/^.*?__/, '');
    }
}
