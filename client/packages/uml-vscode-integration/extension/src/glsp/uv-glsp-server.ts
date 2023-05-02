/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
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

import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver';
import { InitializeParameters } from '@eclipse-glsp/vscode-integration';
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/quickstart-components/socket-glsp-vscode-server';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di.types';
import { GlspServerConfig } from '../server/glsp-server-launcher';

@injectable()
export class UVGlspServer extends SocketGlspVscodeServer {
    constructor(
        @inject(TYPES.GlspServerConfig) protected readonly glspServerConfig: GlspServerConfig,
        @inject(TYPES.ModelServerConfig) protected readonly modelServerConfig: ModelServerConfig
    ) {
        super({
            clientId: 'glsp.uml',
            clientName: 'uml',
            serverPort: glspServerConfig.port
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
