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
import { Args, MaybePromise } from "@eclipse-glsp/client";
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

    readonly id = UmlLanguage.contributionId;
    readonly fileExtensions = UmlLanguage.fileExtensions;

    protected createInitializeOptions(): MaybePromise<Args | undefined> {
        return {
            ["timestamp"]: new Date().toString(),
            ["modelServerURL"]: "http://localhost:8081/api/v1/"
        };
    }

}
