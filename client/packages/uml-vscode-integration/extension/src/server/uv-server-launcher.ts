/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { UmlServerLauncher, UmlServerLauncherOptions } from '@borkdominik-biguml/uml-integration';
import { OutputChannel } from '../vscode/output/output.channel';

export class UVServerLauncher extends UmlServerLauncher {
    constructor(options: UmlServerLauncherOptions, protected readonly outputChannel: OutputChannel) {
        super(options);
    }

    protected override onReady(): void {
        this.outputChannel.channel.appendLine(`The ${this.options.server.logPrefix} listens on port ${this.options.server.port}`);
    }

    protected override onStdoutData(data: string | Buffer): void {
        if (data && this.options.logging) {
            this.outputChannel.channel.appendLine(`${this.options.server.logPrefix} ${data.toString()}`);
        }
    }

    protected override onStderrData(data: string | Buffer): void {
        if (data) {
            console.error(this.options.server.logPrefix, data.toString());
            this.outputChannel.channel.appendLine(`${this.options.server.logPrefix} ${data.toString()}`);
        }
    }

    protected override onProcessError(error: Error): never {
        console.error(this.options.server.logPrefix, error);
        this.outputChannel.channel.appendLine(`${this.options.server.logPrefix} ${error.toString()}`);

        throw error;
    }
}
