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

import { InitializeParameters } from '@eclipse-glsp/vscode-integration';
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/quickstart-components/socket-glsp-vscode-server';
import { injectable } from 'inversify';
import { MODEL_SERVER_CONFIG } from '../../modelserver/uv-modelserver.config';
import { DEFAULT_SERVER_PORT } from '../launcher/launcher';

@injectable()
export class UVGlspServer extends SocketGlspVscodeServer {
    constructor() {
        super({
            clientId: 'glsp.uml',
            clientName: 'uml',
            serverPort: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT)
        });
    }

    protected override async createInitializeParameters(): Promise<InitializeParameters> {
        return {
            ...(await super.createInitializeParameters()),
            args: {
                timestamp: new Date().toString(),
                modelServerURL: MODEL_SERVER_CONFIG.url
            }
        };
    }
}
