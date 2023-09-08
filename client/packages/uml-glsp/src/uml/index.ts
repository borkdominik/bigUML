/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { umlModule } from './di.config';
import { umlCommunicationDiagramModule } from './diagram/communication/di.config';
import { umlPackageDiagramModule } from './diagram/package/di.config';
import { umlClassDiagramModule } from './representation/class/class.module';
import { umlDeploymentDiagramModule } from './representation/deployment/deployment.module';
import { umlStateMachineDiagramModule } from './representation/state-machine/state-machine.module';
import { umlUseCaseDiagramModule } from './representation/usecase/use-case.module';

export const umlDiagramModules = [
    umlModule,
    umlClassDiagramModule,
    umlCommunicationDiagramModule,
    umlUseCaseDiagramModule,
    umlPackageDiagramModule,
    umlStateMachineDiagramModule,
    umlDeploymentDiagramModule
];
