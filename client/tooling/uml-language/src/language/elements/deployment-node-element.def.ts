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
import type { Artifact } from './artifact-element.def.js';
import type { DeploymentSpecification } from './deployment-specification-element.def.js';
import type { Device } from './device-element.def.js';
import type { ExecutionEnvironment } from './execution-environment-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Node',
    icon: 'uml-node-icon'
})
@Glsp.defaults
export class DeploymentNode extends Node {
    name: string;
    visibility?: Visibility;
    nestedNodes?: Array<DeploymentNode>;
    artifacts?: Array<Artifact>;
    devices?: Array<Device>;
    deploymentSpecifications?: Array<DeploymentSpecification>;
    executionEnvironments?: Array<ExecutionEnvironment>;
}
