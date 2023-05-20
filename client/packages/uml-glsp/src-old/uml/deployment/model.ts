/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
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
