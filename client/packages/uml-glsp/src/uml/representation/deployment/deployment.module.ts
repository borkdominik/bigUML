/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
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
    registerCommunicationPathElement(context, UmlDiagramType.DEPLOYMENT);
    registerDependencyElement(context, UmlDiagramType.DEPLOYMENT);
    registerManifestationElement(context, UmlDiagramType.DEPLOYMENT);
    registerDeploymentElement(context, UmlDiagramType.DEPLOYMENT);
    registerGeneralizationElement(context, UmlDiagramType.DEPLOYMENT);
});
