/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver';
import { InitializeParameters } from '@eclipse-glsp/vscode-integration';
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/node/quickstart-components/socket-glsp-vscode-server';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di.types';
import { GlspServerConfig } from '../server/glsp-server.launcher';

@injectable()
export class UVGlspServer extends SocketGlspVscodeServer {
    constructor(
        @inject(TYPES.GlspServerConfig) protected readonly glspServerConfig: GlspServerConfig,
        @inject(TYPES.ModelServerConfig) protected readonly modelServerConfig: ModelServerConfig
    ) {
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
                timestamp: new Date().toString(),
                modelServerURL: `http://localhost:${this.modelServerConfig.port}${this.modelServerConfig.route}`
            }
        };
    }
}
