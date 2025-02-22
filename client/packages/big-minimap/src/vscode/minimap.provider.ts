/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { InitializeCanvasBoundsAction } from '@borkdominik-biguml/uml-protocol';
import { SetModelAction, SetViewportAction, UpdateModelAction } from '@eclipse-glsp/protocol';
import { injectable, postConstruct } from 'inversify';
import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '../common/index.js';

@injectable()
export class MinimapProvider extends BIGReactWebview {
    get id(): string {
        // TODO HAYDAR METIN
        return 'bigUML.panel.minimap';
    }

    protected override cssPath = ['minimap', 'bundle.css'];
    protected override jsPath = ['minimap', 'bundle.js'];

    @postConstruct()
    protected override init(): void {
        super.init();

        this.extensionConnector.cacheActions([InitializeCanvasBoundsAction.KIND, SetViewportAction.KIND, MinimapExportSvgAction.KIND]);
    }

    protected override handleConnection(): void {
        // ==== Webview Extension Host ====
        this.extensionConnector.onActionMessage(message => {
            if (UpdateModelAction.is(message.action) || SetModelAction.is(message.action)) {
                this.extensionConnector.send(RequestMinimapExportSvgAction.create());
            }
        });
        this.extensionConnector.onNoActiveClient(() => {
            this.viewConnector.send(MinimapExportSvgAction.create());
        });

        // ==== Webview View Connection ====
        this.viewConnector.onActionMessage(message => {
            if (message.action.kind === 'minimapIsReady') {
                this.extensionConnector.send(RequestMinimapExportSvgAction.create());
                this.extensionConnector.forwardCachedActionsToWebview();
            } else {
                this.extensionConnector.send(message.action);
            }
        });
    }
}
