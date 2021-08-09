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
import { ModelServerClient } from "@eclipse-emfcloud/modelserver-theia/lib/common";
import { BaseGLSPClientContribution } from "@eclipse-glsp/theia-integration/lib/browser";
import { inject, injectable } from "inversify";

import { UmlLanguage } from "../common/uml-language";

export interface UmlInitializeOptions {
    timestamp: Date;
    modelServerURL: string;
}

@injectable()
export class UmlGLSPClientContribution extends BaseGLSPClientContribution {

    @inject(ModelServerClient) protected readonly modelServerClient: ModelServerClient;

    readonly fileExtensions = [UmlLanguage.FileExtension];
    readonly id = UmlLanguage.Id;
    readonly name = UmlLanguage.Name;

    protected async createInitializeOptions(): Promise<UmlInitializeOptions> {
        // #TODO FIXME: using the launchoptions of the modelserverclient leads to an error, although the values seem to be correct...
        // const options = await this.modelServerClient.getLaunchOptions();

        return {
            timestamp: new Date(),
            modelServerURL: "http://localhost:8081/api/v1/"
        };
    }

}
