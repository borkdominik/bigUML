/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { umlModule } from './di.config';
import { umlClassDiagramModule } from './diagram/class/di.config';
import { umlCommunicationDiagramModule } from './diagram/communication/di.config';

export const umlDiagramModules = [umlModule, umlClassDiagramModule, umlCommunicationDiagramModule];
