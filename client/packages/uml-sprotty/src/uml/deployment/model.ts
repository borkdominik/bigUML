/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { Icon } from '../../model';

// DEPLOYMENT
export class IconArtifact extends Icon {
    override iconImageName = 'deployment/Artifact.svg';
}

export class IconDevice extends Icon {
    override iconImageName = 'deployment/Device.svg';
}

export class IconExecutionEnvironment extends Icon {
    override iconImageName = 'deployment/ExecutionEnvironment.svg';
}

export class IconDeploymentNode extends Icon {
    override iconImageName = 'deployment/DeploymentNode.svg';
}

export class IconDeploymentSpecification extends Icon {
    override iconImageName = 'deployment/DeploymentSpecification.svg';
}
