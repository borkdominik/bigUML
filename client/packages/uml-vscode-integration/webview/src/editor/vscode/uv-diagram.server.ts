/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ExportSvgAction } from '@eclipse-glsp/protocol';
import { GLSPVscodeDiagramServer } from '@eclipse-glsp/vscode-integration-webview';

export class UVDiagramServer extends GLSPVscodeDiagramServer {
    protected override handleExportSvgAction(action: ExportSvgAction): boolean {
        return false;
    }
}
