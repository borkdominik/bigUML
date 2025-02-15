/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/node/quickstart-components/socket-glsp-vscode-server';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di.types.js';
import { GlspServerConfig } from '../server/glsp-server.launcher.js';

export const IDEServerClientId = 'ide.server';

@injectable()
export class IDEServer extends SocketGlspVscodeServer {
    constructor(@inject(TYPES.GlspServerConfig) protected readonly glspServerConfig: GlspServerConfig) {
        super({
            clientId: IDEServerClientId,
            clientName: IDEServerClientId,
            connectionOptions: {
                port: glspServerConfig.port
            }
        });
    }
}
