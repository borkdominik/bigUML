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
import { getPort } from "@eclipse-glsp/protocol";
import {
    JavaSocketServerContribution,
    JavaSocketServerLaunchOptions,
    START_UP_COMPLETE_MSG
} from "@eclipse-glsp/theia-integration/lib/node";
import { ILogger } from "@theia/core";
import { existsSync } from "fs";
import { inject, injectable } from "inversify";
import { join } from "path";

import { UmlLanguage } from "../common/uml-language";
import { findEquinoxLauncher } from "./equinox";

export const PORT_ARG_KEY = "UML_GLSP";
export const SERVER_DIR = join(__dirname, "..", "..", "build");
export const JAR_FILE = join(SERVER_DIR, "com.eclipsesource.uml.glsp.product-0.1.0");

@injectable()
export class UmlGLSPServerContribution extends JavaSocketServerContribution {

    @inject(ILogger) private readonly logger: ILogger;

    readonly id = UmlLanguage.contributionId;

    createLaunchOptions(): Partial<JavaSocketServerLaunchOptions> {
        return {
            jarPath: JAR_FILE,
            additionalArgs: ["--consoleLog", "true"],
            socketConnectionOptions: {
                port: getPort(PORT_ARG_KEY)
            }
        };
    }

    async launch(): Promise<void> {
        if (!existsSync(this.launchOptions.jarPath)) {
            throw new Error(`Could not launch GLSP server. The given jar path is not valid: ${this.launchOptions.jarPath}`);
        }
        if (isNaN(this.launchOptions.socketConnectionOptions.port)) {
            throw new Error(`Could not launch GLSP Server. The given server port is not a number: ${this.launchOptions.socketConnectionOptions.port}`);
        }
        let args = ["-jar", findEquinoxLauncher(this.launchOptions.jarPath), "--port", `${this.launchOptions.socketConnectionOptions.port}`];
        if (this.launchOptions.additionalArgs) {
            args = [...args, ...this.launchOptions.additionalArgs];
        }

        await this.spawnProcessAsync("java", args, undefined);
        return this.onReady;
    }

    protected processLogInfo(data: string | Buffer): void {
        if (data) {
            const message = data.toString();
            if (message.startsWith(START_UP_COMPLETE_MSG)) {
                this.resolveReady();
            }
            this.logger.info(`UmlGLSPServerContribution: ${data}`);
        }
    }

    protected processLogError(data: string | Buffer): void {
        if (data) {
            this.logger.error(`UmlGLSPServerContribution: ${data}`);
        }
    }

}
