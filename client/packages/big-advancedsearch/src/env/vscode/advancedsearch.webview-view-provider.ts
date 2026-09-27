/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '@borkdominik-biguml/big-minimap';
import type { WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import {
    type ActionDispatcher,
    type CacheActionListener,
    type ConnectionManager,
    type GlspModelState,
    TYPES,
    WebviewViewProvider
} from '@borkdominik-biguml/big-vscode/vscode';
import { UndoAction } from '@eclipse-glsp/protocol';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import { type Disposable } from 'vscode';
import * as vscode from 'vscode';
import { AdvancedSearchActionResponse, RequestAdvancedSearchAction } from '../common/advancedsearch.action.js';
import { ModelChangedNotification } from '../common/model-change.notification.js';
import { ReplaceActionResponse } from '../common/replace.action.js';
import type { SearchResult } from '../common/searchresult.js';
import { UndoNotification } from '../common/undo.notification.js';
import { PreviewsDisabledNotification, PreviewsEnabledNotification, ToggleSyntaxNotification } from '../common/view-chrome.notification.js';

const PREVIEWS_ON_CONTEXT = 'bigUML.advancedsearch.previewsOn';

@injectable()
export class AdvancedSearchWebviewViewProvider extends WebviewViewProvider {
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    @inject(TYPES.GlspModelState)
    protected readonly modelState: GlspModelState;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    protected actionCache: CacheActionListener;
    protected currentDiagramSvg: string | undefined;
    protected pendingSearchResults: SearchResult[] | undefined;
    protected pendingFindPattern: string | undefined;
    protected svgExportInFlight = false;
    protected lastQuery = '';

    constructor(@inject(TYPES.WebviewViewOptions) options: WebviewViewProviderOptions) {
        super({
            viewId: options.viewType,
            viewType: options.viewType,
            htmlOptions: {
                files: {
                    js: [['advancedsearch', 'bundle.js']],
                    css: [['advancedsearch', 'bundle.css']]
                }
            }
        });
    }

    @postConstruct()
    protected init(): void {
        this.actionCache = this.actionListener.createCache([AdvancedSearchActionResponse.KIND, ReplaceActionResponse.KIND]);
        this.toDispose.push(this.actionCache);

        this.toDispose.push(
            this.connector.onClientActionMessage(message => {
                if (MinimapExportSvgAction.is(message.action)) {
                    const { svg } = message.action as MinimapExportSvgAction;
                    this.currentDiagramSvg = svg;
                    this.svgExportInFlight = false;

                    if (this.pendingSearchResults) {
                        this.actionMessenger.dispatch(
                            AdvancedSearchActionResponse.create({
                                results: this.pendingSearchResults,
                                findPattern: this.pendingFindPattern,
                                fullDiagramSvg: svg
                            })
                        );
                        this.pendingSearchResults = undefined;
                        this.pendingFindPattern = undefined;
                    } else {
                        // Prefetch complete with no pending search — tell browser to clear the loading indicator
                        this.actionMessenger.dispatch(AdvancedSearchActionResponse.create({ exportInFlight: false }));
                    }
                }
            })
        );
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        vscode.commands.executeCommand('setContext', PREVIEWS_ON_CONTEXT, false);
        disposables.push(
            super.resolveWebviewProtocol(messenger),
            vscode.commands.registerCommand('bigUML.advancedsearch.toggleSyntax', () => {
                messenger.sendNotification(ToggleSyntaxNotification.TYPE, undefined);
            }),
            vscode.commands.registerCommand('bigUML.advancedsearch.enablePreviews', () => {
                vscode.commands.executeCommand('setContext', PREVIEWS_ON_CONTEXT, true);
                messenger.sendNotification(PreviewsEnabledNotification.TYPE, undefined);
            }),
            vscode.commands.registerCommand('bigUML.advancedsearch.disablePreviews', () => {
                vscode.commands.executeCommand('setContext', PREVIEWS_ON_CONTEXT, false);
                messenger.sendNotification(PreviewsDisabledNotification.TYPE, undefined);
            }),
            this.actionMessenger.onActionMessage(message => {
                if (RequestAdvancedSearchAction.is(message.action)) {
                    this.lastQuery = message.action.query;
                }
            }),
            this.actionCache.onDidChange(message => {
                if (AdvancedSearchActionResponse.is(message.action) && message.action.results.length > 0) {
                    const results = message.action.results;

                    if (this.currentDiagramSvg) {
                        this.actionMessenger.dispatch(
                            AdvancedSearchActionResponse.create({
                                results,
                                findPattern: message.action.findPattern,
                                fullDiagramSvg: this.currentDiagramSvg
                            })
                        );
                    } else {
                        this.actionMessenger.dispatch(message);
                        this.pendingSearchResults = results.map(r => ({ ...r }));
                        this.pendingFindPattern = message.action.findPattern;
                        this.prefetchSvg();
                    }
                } else {
                    this.actionMessenger.dispatch(message);
                }
            }),
            this.connectionManager.onDidActiveClientChange(() => {
                this.currentDiagramSvg = undefined;
                this.svgExportInFlight = false;
                this.pendingSearchResults = undefined;
                this.actionMessenger.dispatch(AdvancedSearchActionResponse.create());
                this.prefetchSvg();
                this.requestModel();
            }),
            this.connectionManager.onNoActiveClient(() => {
                this.currentDiagramSvg = undefined;
                this.svgExportInFlight = false;
                this.pendingSearchResults = undefined;
                this.actionMessenger.dispatch(AdvancedSearchActionResponse.create());
            }),
            this.connectionManager.onNoConnection(() => {
                this.currentDiagramSvg = undefined;
                this.svgExportInFlight = false;
                this.pendingSearchResults = undefined;
                this.actionMessenger.dispatch(AdvancedSearchActionResponse.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                // Refresh the cached diagram SVG so thumbnails reflect the new model.
                this.currentDiagramSvg = undefined;
                this.svgExportInFlight = false;
                this.pendingSearchResults = undefined;
                this.prefetchSvg();
                // Tell the webview the model changed and let it re-run its CURRENT
                // query (and retire any post-replace status / Undo). Requesting a
                // search from here would clobber the user's filtered results.
                messenger.sendNotification(ModelChangedNotification.TYPE, undefined);
            }),
            // UndoAction is a client-side GLSP action — must be routed to the
            // active GLSP client (the diagram webview), which then sends an
            // UndoOperation to the server. Dispatching it via the server-side
            // actionDispatcher would silently no-op.
            messenger.onNotification(UndoNotification.TYPE, () => {
                // Without an active diagram client there is nothing to undo in;
                // ignore the click instead of pretending it worked. The webview
                // only retires its status once a model change comes back.
                if (this.connectionManager.hasActiveClient()) {
                    this.connector.sendActionToActiveClient(UndoAction.create());
                }
            })
        );
        return disposables;
    }

    protected override handleOnReady(): void {
        this.prefetchSvg();
        this.requestModel();
        this.actionMessenger.dispatch(this.actionCache.getActions());
    }

    protected requestModel(): void {
        this.actionDispatcher.dispatch(RequestAdvancedSearchAction.create({ query: this.lastQuery }));
    }

    protected override handleOnVisible(): void {
        this.actionMessenger.dispatch(this.actionCache.getActions());
    }

    protected prefetchSvg(): void {
        if (!this.currentDiagramSvg && !this.svgExportInFlight && this.connectionManager.hasActiveClient()) {
            this.svgExportInFlight = true;
            this.connector.sendActionToActiveClient(RequestMinimapExportSvgAction.create());
            this.actionMessenger.dispatch(AdvancedSearchActionResponse.create({ exportInFlight: true }));
        }
    }
}
