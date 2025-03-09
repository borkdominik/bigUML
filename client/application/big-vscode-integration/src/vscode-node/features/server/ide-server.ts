/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../vscode/vscode-common.types.js';
import type { GLSPServerConfig } from './glsp-server.module.js';

export const IDEServerClientId = 'ide.server';

@injectable()
export class IDEServer extends SocketGlspVscodeServer {
    constructor(@inject(TYPES.GLSPServerConfig) protected readonly glspServerConfig: GLSPServerConfig) {
        super({
            clientId: IDEServerClientId,
            clientName: 'ide',
            connectionOptions: {
                port: glspServerConfig.port
            }
        });
    }
}
