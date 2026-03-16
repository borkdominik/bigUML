/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { umlActivityDiagramModule } from './diagram/activity/activity.module.js';
import { umlClassDiagramModule } from './diagram/class/class.module.js';
import { umlCommunicationDiagramModule } from './diagram/communication/communication.module.js';
import { umlDeploymentDiagramModule } from './diagram/deployment/deployment.module.js';
import { umlInformationFlowDiagramModule } from './diagram/information_flow/di.config.js';
import { umlPackageDiagramModule } from './diagram/package/package.module.js';
import { umlSequenceDiagramModule } from './diagram/sequence/di.config.js';
import { umlStateMachineDiagramModule } from './diagram/state-machine/state-machine.module.js';
import { umlUseCaseDiagramModule } from './diagram/usecase/use-case.module.js';
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
