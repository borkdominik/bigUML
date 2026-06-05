/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import 'reflect-metadata';
import { Node, type Visibility } from '../core/element.def.js';
import type { DeploymentNode } from './deployment-node-element.def.js';
import type { DeploymentSpecification } from './deployment-specification-element.def.js';
import type { ExecutionEnvironment } from './execution-environment-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Device',
    icon: 'uml-device-icon'
})
@Glsp.defaults
export class Device extends Node {
    name: string;
    visibility?: Visibility;
    nodes?: Array<DeploymentNode>;
    executionEnvironments?: Array<ExecutionEnvironment>;
    deploymentSpecifications?: Array<DeploymentSpecification>;
}
