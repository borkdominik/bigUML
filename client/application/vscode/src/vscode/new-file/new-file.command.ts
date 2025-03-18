/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, injectable } from 'inversify';
import { type Uri } from 'vscode';
import { type VSCodeCommand } from '../command/command.js';
import { NewFileCreator } from './new-file.creator.js';

@injectable()
export class NewFileCommand implements VSCodeCommand {
    constructor(@inject(NewFileCreator) private creator: NewFileCreator) {}

    get id(): string {
        return 'bigUML.model.newEmpty';
    }

    execute(...args: any[]): void {
        let uri: Uri | undefined = undefined;
        if (args[0] !== undefined && args[0] !== null) {
            uri = args[0];
        }

        this.creator.create(uri);
    }
}
