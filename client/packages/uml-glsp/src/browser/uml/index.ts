/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { umlSequenceDiagramModule } from './diagram/sequence/di.config.js';
import { umlActivityDiagramModule } from './representation/activity/activity.module.js';
import { umlClassDiagramModule } from './representation/class/class.module.js';
import { umlCommunicationDiagramModule } from './representation/communication/communication.module.js';
import { umlDeploymentDiagramModule } from './representation/deployment/deployment.module.js';
import { umlInformationFlowDiagramModule } from './representation/information_flow/di.config.js';
import { umlPackageDiagramModule } from './representation/package/package.module.js';
import { umlStateMachineDiagramModule } from './representation/state-machine/state-machine.module.js';
import { umlUseCaseDiagramModule } from './representation/usecase/use-case.module.js';
import { umlModule } from './uml.module.js';

export const umlDiagramModules = [
    umlModule,
    umlClassDiagramModule,
    umlCommunicationDiagramModule,
    umlUseCaseDiagramModule,
    umlPackageDiagramModule,
    umlStateMachineDiagramModule,
    umlDeploymentDiagramModule,
    umlActivityDiagramModule,
    umlInformationFlowDiagramModule,
    umlSequenceDiagramModule
];
