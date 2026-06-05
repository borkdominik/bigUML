/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import type { MetaInfo } from './core/element.def.js';
import type { ActivityDiagram } from './diagram/activity-diagram.def.js';
import type { ClassDiagram } from './diagram/class-diagram.def.js';
import type { CommunicationDiagram } from './diagram/communication-diagram.def.js';
import type { DeploymentDiagram } from './diagram/deployment-diagram.def.js';
import type { InformationFlowDiagram } from './diagram/information-flow-diagram.def.js';
import type { PackageDiagram } from './diagram/package-diagram.def.js';
import type { StateMachineDiagram } from './diagram/state-machine-diagram.def.js';
import type { UseCaseDiagram } from './diagram/use-case-diagram.def.js';

// @ts-nocheck

export type DiagramType =
    | ActivityDiagram
    | ClassDiagram
    | CommunicationDiagram
    | DeploymentDiagram
    | InformationFlowDiagram
    | PackageDiagram
    | StateMachineDiagram
    | UseCaseDiagram;

@Language.root
export class Diagram {
    diagram: DiagramType;
    metaInfos?: Array<MetaInfo>;
}
