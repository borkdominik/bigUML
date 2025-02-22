/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SocketGlspVscodeServer, type InitializeParameters } from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../vscode/vscode-common.types.js';
import type { GLSPServerConfig } from './glsp-server.module.js';

@injectable()
export class GLSPServer extends SocketGlspVscodeServer {
    constructor(@inject(TYPES.GLSPServerConfig) protected readonly glspServerConfig: GLSPServerConfig) {
        super({
            clientId: 'glsp.uml',
            clientName: 'uml',
            connectionOptions: {
                port: glspServerConfig.port
            }
        });
    }

    protected override async createInitializeParameters(): Promise<InitializeParameters> {
        return {
            ...(await super.createInitializeParameters()),
            args: {
                timestamp: new Date().toString()
            }
        };
    }
}
