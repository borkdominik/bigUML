/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '../common/index.js';
import { SetNavigationIdNotification } from '../common/protocol.js';

export const PropertyPaletteViewId = Symbol('PropertyPaletteViewId');

@injectable()
export class PropertyPaletteProvider extends BIGReactWebview {
    @inject(PropertyPaletteViewId)
    viewId: string;

    protected override cssPath = ['property-palette', 'bundle.css'];
    protected override jsPath = ['property-palette', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([SetPropertyPaletteAction.KIND]);
    protected selectedId?: string;

    @postConstruct()
    protected override init(): void {
        super.init();

        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.webviewConnector.onReady(async () => {
                const selection = this.selectionService.selection;
                if (selection && selection.selectedElementsIDs.length > 0) {
                    this.selectedId = selection.selectedElementsIDs[0];
                    this.requestPropertyPalette();
                }
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.webviewConnector.registerNotificationListener(SetNavigationIdNotification, id => {
                this.selectedId = id ?? this.selectionService.selection?.selectedElementsIDs[0];
            }),
            this.selectionService.onDidSelectionChange(event => {
                this.selectedId = event.state.selectedElementsIDs[0];
                this.requestPropertyPalette();
            }),
            this.connectionManager.onNoConnection(() => {
                this.webviewConnector.dispatch(SetPropertyPaletteAction.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                this.requestPropertyPalette();
            })
        );
    }

    protected requestPropertyPalette(elementId = this.selectedId): void {
        this.actionDispatcher.dispatch(
            RequestPropertyPaletteAction.create({
                elementId
            })
        );
    }
}
