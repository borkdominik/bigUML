/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Command } from '@theia/core';

export const NEW_FILE_COMMAND: Command = {
    id: 'file.newUmlDiagram',
    category: 'File',
    label: 'New UML Diagram',
    iconClass: 'umlmodelfile'
};
