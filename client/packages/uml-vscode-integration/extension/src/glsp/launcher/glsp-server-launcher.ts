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

import { GlspServerLauncher } from '@eclipse-glsp/vscode-integration/lib/quickstart-components/glsp-server-launcher';
import * as childProcess from 'child_process';

const LOG_PREFIX = '[GLSP-Server]';

export class UmlGLSPServerLauncher extends GlspServerLauncher {
    protected override startJavaProcess(): childProcess.ChildProcessWithoutNullStreams {
        if (!this.options.executable.endsWith('jar')) {
            throw new Error(`Could not launch Java GLSP server. The given executable is no JAR: ${this.options.executable}`);
        }

        // TODO: Workaround https://github.com/eclipse-glsp/glsp/issues/727
        const args = [
            '--add-opens',
            'java.base/java.util=ALL-UNNAMED',
            '-jar',
            this.options.executable,
            '--port',
            `${this.options.socketConnectionOptions.port}`,
            ...this.options.additionalArgs
        ];

        if (this.options.socketConnectionOptions.host) {
            args.push('--host', `${this.options.socketConnectionOptions.host}`);
        }
        return childProcess.spawn('java', args);
    }

    protected override handleStdoutData(data: string | Buffer): void {
        if (this.options.logging) {
            console.log(LOG_PREFIX, data.toString());
        }
    }

    protected override handleStderrData(data: string | Buffer): void {
        if (data && this.options.logging) {
            console.error(LOG_PREFIX, data.toString());
        }
    }

    protected override handleProcessError(error: Error): never {
        if (this.options.logging) {
            console.error(LOG_PREFIX, error);
        }

        throw error;
    }
}
