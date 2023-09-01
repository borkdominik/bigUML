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
import {UmlDiagramType} from '@borkdominik-biguml/uml-common';
import {DefaultTypes} from '@eclipse-glsp/client';
import {QualifiedUtil} from '../../qualified.utils';

export namespace UmlDeploymentTypes {
    export const DEPLOYMENT_SPECIFICATION = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.NODE, 'DeploymentSpecification');

    export const ARTIFACT = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.NODE, 'Artifact');

    export const DEVICE = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.NODE, 'Device');

    export const EXECUTION_ENVIRONMENT = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.NODE, 'ExecutionEnvironment');

    export const MODEL = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.NODE, 'Model');

    export const NODE = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.NODE, 'Node');

    export const PACKAGE = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.NODE, 'Package');

    export const COMMUNICATION_PATH = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.EDGE, 'CommunicationPath');
    export const DEPENDENCY = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.EDGE, 'Dependency');
    export const MANIFESTATION = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.EDGE, 'Manifestation');
    export const DEPLOYMENT = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.EDGE, 'Deployment');

    export const PROPERTY_LABEL_TYPE = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.LABEL, 'Property-type');

    export const PROPERTY_LABEL_MULTIPLICITY = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.LABEL, 'Property-multiplicity');

    export const PROPERTY = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.COMPARTMENT, 'Property');

    export const OPERATION = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.COMPARTMENT, 'Operation');

    export const GENERALIZATION = QualifiedUtil.representationTypeId(UmlDiagramType.DEPLOYMENT, DefaultTypes.EDGE, 'Generalization');

}
