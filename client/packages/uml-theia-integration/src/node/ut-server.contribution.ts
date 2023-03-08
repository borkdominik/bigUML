/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { getPort, GLSPSocketServerContribution, GLSPSocketServerContributionOptions } from '@eclipse-glsp/theia-integration/lib/node';
import { injectable } from 'inversify';

import { UTDiagramLanguage } from '../common/language';

const PORT_ARG_KEY = 'UML_GLSP_PORT';

@injectable()
export class UTServerContribution extends GLSPSocketServerContribution {
    readonly id = UTDiagramLanguage.contributionId;

    createContributionOptions(): Partial<GLSPSocketServerContributionOptions> {
        return {
            socketConnectionOptions: {
                port: getPort(PORT_ARG_KEY)
            }
        };
    }

    /* TODO: Enable this again
    @inject(ILogger) private readonly logger: ILogger;

    override async launch(): Promise<void> {
        if (!existsSync(this.options.executable)) {
            throw new Error(`Could not launch GLSP server. The given jar path is not valid: ${this.launchOptions.jarPath}`);
        }
        if (isNaN(this.options.socketConnectionOptions.port)) {
            throw new Error(
                `Could not launch GLSP Server. The given server port is not a number: ${this.launchOptions.socketConnectionOptions.port}`
            );
        }
        let args = [
            '-jar',
            findEquinoxLauncher(this.launchOptions.jarPath),
            '--port',
            `${this.launchOptions.socketConnectionOptions.port}`
        ];
        if (this.launchOptions.additionalArgs) {
            args = [...args, ...this.launchOptions.additionalArgs];
        }

        await this.spawnProcessAsync('java', args, undefined);
        return this.onReady;
    }

    protected override processLogInfo(data: string | Buffer): void {
        if (data) {
            const message = data.toString();
            if (message.startsWith(START_UP_COMPLETE_MSG)) {
                this.resolveReady();
            }
            this.logger.info(`UmlGLSPServerContribution: ${data}`);
        }
    }

    protected override processLogError(data: string | Buffer): void {
        if (data) {
            this.logger.error(`UmlGLSPServerContribution: ${data}`);
        }
    }
    */
}
