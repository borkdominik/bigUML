/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/node/quickstart-components/socket-glsp-vscode-server.js';
import { inject, injectable } from 'inversify';
import type { OutputChannel } from '../../../vscode/features/output/output.channel.js';
import { TYPES } from '../../../vscode/vscode-common.types.js';
import type { ServerLauncherOptions } from './launcher/launcher.js';
import { BIGServerLauncher } from './launcher/server-launcher.js';

@injectable()
export class GLSPServerLauncher extends BIGServerLauncher {
    get isEnabled(): boolean {
        return process.env.UML_GLSP_SERVER_DEBUG !== 'true';
    }

    constructor(
        @inject(TYPES.GLSPServerLaunchOptions) options: ServerLauncherOptions,
        @inject(TYPES.OutputChannel) outputChannel: OutputChannel
    ) {
        super(options, outputChannel);
    }

    override async ping(): Promise<void> {
        const server = new SocketGlspVscodeServer({
            clientId: 'ping_1',
            clientName: 'ping',
            connectionOptions: {
                port: this.options.server.port
            }
        });
        await server.start();
        await server.dispose();
    }
}
