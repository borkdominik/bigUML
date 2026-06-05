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
import type { Artifact } from '../elements/artifact-element.def.js';
import type { CommunicationPath } from '../elements/communication-path-element.def.js';
import type { Dependency } from '../elements/dependency-element.def.js';
import type { Deployment } from '../elements/deployment-element.def.js';
import type { DeploymentModel } from '../elements/deployment-model-element.def.js';
import type { DeploymentNode } from '../elements/deployment-node-element.def.js';
import type { DeploymentPackage } from '../elements/deployment-package-element.def.js';
import type { DeploymentSpecification } from '../elements/deployment-specification-element.def.js';
import type { Device } from '../elements/device-element.def.js';
import type { ExecutionEnvironment } from '../elements/execution-environment-element.def.js';
import type { Generalization } from '../elements/generalization-element.def.js';
import type { Manifestation } from '../elements/manifestation-element.def.js';
import type { Operation } from '../elements/operation-element.def.js';
import type { Parameter } from '../elements/parameter-element.def.js';
import type { Property } from '../elements/property-element.def.js';

// @ts-nocheck

@Glsp.defaults
export class DeploymentDiagram {
    diagramType: 'DEPLOYMENT';
    entities?: Array<DeploymentDiagramNodes>;
    relations?: Array<DeploymentDiagramEdges>;
}

type DeploymentDiagramElements = DeploymentDiagramNodes | DeploymentDiagramEdges;

type DeploymentDiagramNodes =
    | Artifact
    | DeploymentSpecification
    | Device
    | ExecutionEnvironment
    | DeploymentModel
    | DeploymentNode
    | DeploymentPackage
    | Property
    | Operation
    | Parameter;

type DeploymentDiagramEdges = CommunicationPath | Dependency | Manifestation | Deployment | Generalization;
