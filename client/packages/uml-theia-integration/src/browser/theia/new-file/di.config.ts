/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ContainerContext } from '@eclipse-glsp/theia-integration';
import { CommandContribution, MenuContribution } from '@theia/core';
import { NewFileCommandContribution } from './new-file.command-contribution';
import { NewFileCreator } from './new-file.creator';
import { NewFileMenuContribution } from './new-file.menu-contribution';

export function registerNewFileModule(context: ContainerContext): void {
    context.bind(CommandContribution).to(NewFileCommandContribution);
    context.bind(MenuContribution).to(NewFileMenuContribution);
    context.bind(NewFileCreator).toSelf();
}
