/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import {
    type ActionDispatcher,
    type CacheActionListener,
    type ConnectionManager,
    type GlspModelState,
    type SelectionService,
    TYPES,
    WebviewViewProvider
} from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import type { Disposable } from 'vscode';
import {
    AvailableExportTemplatesResponse,
    ExportInstancesNotification,
    ExportInstancesResponse,
    GeneratableClassifiersResponse,
    GenerateInstancesPreviewResponse,
    InstanceExplorerDataResponse,
    RequestGeneratableClassifiersAction,
    RequestInstanceExplorerDataAction,
    SaveExportedInstancesResponse
} from '../common/index.js';
import { InstanceExportService } from './export.service.js';

@injectable()
export class InstanceExplorerWebviewViewProvider extends WebviewViewProvider {
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    @inject(TYPES.GlspModelState)
    protected readonly modelState: GlspModelState;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    @inject(TYPES.SelectionService)
    protected readonly selectionService: SelectionService;

    @inject(InstanceExportService)
    protected readonly exportService: InstanceExportService;

    protected actionCache: CacheActionListener;

    constructor(@inject(TYPES.WebviewViewOptions) options: WebviewViewProviderOptions) {
        super({
            viewId: options.viewType,
            viewType: options.viewType,
            htmlOptions: {
                files: {
                    js: [['instance-explorer', 'bundle.js']],
                    css: [['instance-explorer', 'bundle.css']]
                }
            }
        });
    }

    @postConstruct()
    protected init(): void {
        this.actionCache = this.actionListener.createCache([
            InstanceExplorerDataResponse.KIND,
            AvailableExportTemplatesResponse.KIND,
            ExportInstancesResponse.KIND,
            SaveExportedInstancesResponse.KIND,
            GeneratableClassifiersResponse.KIND,
            GenerateInstancesPreviewResponse.KIND
        ]);
        this.toDispose.push(this.actionCache);
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(
            super.resolveWebviewProtocol(messenger),
            this.actionCache.onDidChange(message => this.actionMessenger.dispatch(message)),
            this.connectionManager.onDidActiveClientChange(() => this.requestData()),
            this.connectionManager.onNoActiveClient(() => this.actionMessenger.dispatch(InstanceExplorerDataResponse.create())),
            this.connectionManager.onNoConnection(() => this.actionMessenger.dispatch(InstanceExplorerDataResponse.create())),
            this.modelState.onDidChangeModelState(() => this.requestData()),
            this.selectionService.onDidSelectionChange(() => this.dispatchSelectionChange()),
            this.exportService.onDidRequestOpenExportDialog(() => this.openExportDialog())
        );
        return disposables;
    }

    protected override handleOnReady(): void {
        this.requestData();
        this.actionMessenger.dispatch(this.actionCache.getActions());
        this.dispatchSelectionChange();
        if (this.exportService.consumePendingOpenDialogRequest()) {
            void this.openExportDialog();
        }
    }

    protected override handleOnVisible(): void {
        this.actionMessenger.dispatch(this.actionCache.getActions());
        this.dispatchSelectionChange();
    }

    protected requestData(): void {
        this.actionDispatcher.dispatch(RequestInstanceExplorerDataAction.create());
        // Refresh the generatable classifiers/associations too, so the "Generate Test Data" dialog
        // always reflects the active diagram (and any class-diagram edits) instead of a cached/stale
        // set from a previously opened model.
        this.actionDispatcher.dispatch(RequestGeneratableClassifiersAction.create());
    }

    protected dispatchSelectionChange(): void {
        this.webviewMessenger.sendNotification(ExportInstancesNotification.SelectionChanged, {
            selectedElementIds: this.exportService.getSelectedElementIds()
        });
    }

    protected async openExportDialog(): Promise<void> {
        this.actionMessenger.dispatch(await this.exportService.getAvailableTemplates());
        this.webviewMessenger.sendNotification(ExportInstancesNotification.OpenDialog, {
            source: 'command'
        });
    }
}
