/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Uri, type Webview } from 'vscode';

export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export function getBundleUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
    return getUri(webview, extensionUri, ['webviews', ...pathList]);
}
