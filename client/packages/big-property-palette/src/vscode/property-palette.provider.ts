/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    BIGReactWebview
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { injectable, postConstruct } from 'inversify';
import { RefreshPropertyPaletteAction, SetPropertyPaletteAction } from '../common/index.js';

@injectable()
export class PropertyPaletteProvider extends BIGReactWebview {
    get id(): string {
        // TODO HAYDAR METIN
        return 'bigUML.panel.property-palette';
    }

    protected override cssPath = ['property-palette', 'bundle.css'];
    protected override jsPath = ['property-palette', 'bundle.js'];

    @postConstruct()
    protected override init(): void {
        super.init();

        this.extensionConnector.cacheActions([SetPropertyPaletteAction.KIND]);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.extensionConnector.onDidActiveClientChange(client => {
            this.extensionConnector.sendTo(client.clientId, RefreshPropertyPaletteAction.create());
        });
        this.extensionConnector.onNoActiveClient(() => {
            this.viewConnector.send(SetPropertyPaletteAction.create());
        });
    }
}
