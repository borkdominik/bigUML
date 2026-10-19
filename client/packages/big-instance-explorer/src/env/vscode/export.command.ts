/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeSettings } from '@borkdominik-biguml/big-vscode';
import { type VSCodeCommand } from '@borkdominik-biguml/big-vscode/vscode';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { InstanceExportService } from './export.service.js';

@injectable()
export class ExportInstancesCommand implements VSCodeCommand {
    constructor(@inject(InstanceExportService) protected readonly exportService: InstanceExportService) {}

    get id(): string {
        return 'bigUML.exportInstances';
    }

    async execute(): Promise<void> {
        await vscode.commands.executeCommand(`${VSCodeSettings.instanceExplorer.viewType}.focus`);
        this.exportService.requestOpenExportDialog();
    }
}
