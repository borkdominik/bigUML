/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { WebviewHtmlProviderOptions } from './base/webview-html-provider.js';

export interface WebviewProviderOptions {
    viewId: string;
    viewType: string;
    htmlOptions: WebviewHtmlProviderOptions;
}
