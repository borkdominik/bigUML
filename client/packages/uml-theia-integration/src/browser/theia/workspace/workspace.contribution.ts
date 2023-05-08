/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { MaybePromise } from '@theia/core';
import { FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { inject, injectable } from 'inversify';
import { WorkspaceWatcher } from './workspace.watcher';

@injectable()
export class WorkspaceContribution implements FrontendApplicationContribution {
    @inject(WorkspaceWatcher)
    protected readonly watcher: WorkspaceWatcher;

    onStart(app: FrontendApplication): MaybePromise<void> {
        this.watcher.watch();
    }
}
