/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/uml-protocol';
import { ContainerModule } from 'inversify';
import {
    registerArtifactElement,
    registerCommunicationPathElement,
    registerDependencyElement,
    registerDeploymentElement,
    registerDeploymentSpecificationElement,
    registerDeviceElement,
    registerExecutionEnvironmentElement,
    registerGeneralizationElement,
    registerManifestationElement,
    registerModelElement,
    registerNodeElement,
    registerOperationElement,
    registerPackageElement,
    registerParameterElement,
    registerPropertyElement
} from '../../elements/index';

export const umlDeploymentDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    registerDeploymentSpecificationElement(context, UmlDiagramType.DEPLOYMENT);
    registerArtifactElement(context, UmlDiagramType.DEPLOYMENT);
    registerDeviceElement(context, UmlDiagramType.DEPLOYMENT);
    registerExecutionEnvironmentElement(context, UmlDiagramType.DEPLOYMENT);
    registerModelElement(context, UmlDiagramType.DEPLOYMENT);
    registerNodeElement(context, UmlDiagramType.DEPLOYMENT);
    registerPackageElement(context, UmlDiagramType.DEPLOYMENT);
    registerPropertyElement(context, UmlDiagramType.DEPLOYMENT);
    registerOperationElement(context, UmlDiagramType.DEPLOYMENT);
    registerParameterElement(context, UmlDiagramType.DEPLOYMENT);
    registerCommunicationPathElement(context, UmlDiagramType.DEPLOYMENT);
    registerDependencyElement(context, UmlDiagramType.DEPLOYMENT);
    registerManifestationElement(context, UmlDiagramType.DEPLOYMENT);
    registerDeploymentElement(context, UmlDiagramType.DEPLOYMENT);
    registerGeneralizationElement(context, UmlDiagramType.DEPLOYMENT);
});
