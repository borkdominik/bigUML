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
import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { FeatureModule } from '@eclipse-glsp/client';
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
} from '../../elements/index.js';

export const umlDeploymentDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    registerDeploymentSpecificationElement(context, UMLDiagramType.DEPLOYMENT);
    registerArtifactElement(context, UMLDiagramType.DEPLOYMENT);
    registerDeviceElement(context, UMLDiagramType.DEPLOYMENT);
    registerExecutionEnvironmentElement(context, UMLDiagramType.DEPLOYMENT);
    registerModelElement(context, UMLDiagramType.DEPLOYMENT);
    registerNodeElement(context, UMLDiagramType.DEPLOYMENT);
    registerPackageElement(context, UMLDiagramType.DEPLOYMENT);
    registerPropertyElement(context, UMLDiagramType.DEPLOYMENT);
    registerOperationElement(context, UMLDiagramType.DEPLOYMENT);
    registerParameterElement(context, UMLDiagramType.DEPLOYMENT);
    registerCommunicationPathElement(context, UMLDiagramType.DEPLOYMENT);
    registerDependencyElement(context, UMLDiagramType.DEPLOYMENT);
    registerManifestationElement(context, UMLDiagramType.DEPLOYMENT);
    registerDeploymentElement(context, UMLDiagramType.DEPLOYMENT);
    registerGeneralizationElement(context, UMLDiagramType.DEPLOYMENT);
});
