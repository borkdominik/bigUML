/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { DefaultTypes } from '@eclipse-glsp/client';
import { QualifiedUtil } from '../../qualified.utils';

export namespace UmlUseCaseTypes {
    export const USE_CASE = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.NODE, 'UseCase');

    export const SUBJECT = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.NODE, 'Subject');

    export const ACTOR = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.NODE, 'Actor');

    export const STICKFIGURE_NODE = QualifiedUtil.representationTemplateTypeId(
        UmlDiagramType.USE_CASE,
        DefaultTypes.NODE,
        'GModel',
        'STICKFIGURE'
    );

    export const PROPERTY = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.COMPARTMENT, 'Property');
    export const PROPERTY_LABEL_TYPE = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.LABEL, 'Property-type');
    export const PROPERTY_LABEL_MULTIPLICITY = QualifiedUtil.representationTypeId(
        UmlDiagramType.USE_CASE,
        DefaultTypes.LABEL,
        'Property-multiplicity'
    );

    export const INCLUDE = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.EDGE, 'Include');

    export const EXTEND = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.EDGE, 'Extend');

    export const ASSOCIATION = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.EDGE, 'Association');

    export const GENERALIZATION = QualifiedUtil.representationTypeId(UmlDiagramType.USE_CASE, DefaultTypes.EDGE, 'Generalization');
}
