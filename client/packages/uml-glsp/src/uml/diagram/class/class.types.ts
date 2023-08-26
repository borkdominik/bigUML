/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { DefaultTypes } from '@eclipse-glsp/client';
import { QualifiedUtil } from '../../qualified.utils';

export namespace UmlClassTypes {
    export const CLASS = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.NODE, 'Class');
    export const DATA_TYPE = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.NODE, 'DataType');
    export const ENUMERATION = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.NODE, 'Enumeration');
    export const ENUMERATION_LITERAL = QualifiedUtil.representationTypeId(
        UmlDiagramType.CLASS,
        DefaultTypes.COMPARTMENT,
        'EnumerationLiteral'
    );
    export const INTERFACE = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.NODE, 'Interface');
    export const OPERATION = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.COMPARTMENT, 'Operation');

    export const PACKAGE = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.NODE, 'Package');
    export const PRIMITIVE_TYPE = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.NODE, 'PrimitiveType');

    export const ABSTRACTION = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.EDGE, 'Abstraction');

    export const DEPENDENCY = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.EDGE, 'Dependency');
    export const GENERALIZATION = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.EDGE, 'Generalization');
    export const INTERFACE_REALIZATION = QualifiedUtil.representationTypeId(
        UmlDiagramType.CLASS,
        DefaultTypes.EDGE,
        'InterfaceRealization'
    );
    export const REALIZATION = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.EDGE, 'Realization');
    export const SUBSTITUTION = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.EDGE, 'Substitution');
    export const USAGE = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.EDGE, 'Usage');
    export const PACKAGE_IMPORT = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.EDGE, 'PackageImport');
    export const PACKAGE_MERGE = QualifiedUtil.representationTypeId(UmlDiagramType.CLASS, DefaultTypes.EDGE, 'PackageMerge');
}
