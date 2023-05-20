/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ContainerContext } from '@eclipse-glsp/theia-integration';
import { FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { WorkspaceContribution } from './workspace.contribution';
import { WorkspaceWatcher } from './workspace.watcher';

export function registerWorkspaceModule(context: ContainerContext): void {
    context.bind(FrontendApplicationContribution).to(WorkspaceContribution);
    context.bind(WorkspaceWatcher).toSelf().inSingletonScope();
}
