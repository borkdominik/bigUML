/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node.js';

export interface LanguageClientConfig {
    modelServer_serverOptions: ServerOptions;
    modelServer_clientOptions: LanguageClientOptions;
}
export interface ModelServerOptions {
    host: string;
    port: number;
}
