/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { type DiagramSerializer, type ModelService, type QualifiedNameProvider } from '@borkdominik-biguml/model-server';
import { type Diagram } from '@borkdominik-biguml/model-server/grammar';
import { UmlDiagramLSPServices } from '@borkdominik-biguml/model-server/integration';
import { ActionDispatcher, type JsonModelState, MessageAction, type SeverityLevel } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { BaseDiagramModelState } from '../../../common/model/base-diagram-model-state.js';
import { ClassDiagramModelIndex } from './class-diagram-model-index.js';

export interface ClassDiagramSourceModel {
    text: string;
}

/**
 * Custom model state that does not only keep track of the GModel root but also the semantic root.
 * It also provides convenience methods for accessing specific language services.
 */
@injectable()
export class ClassDiagramModelState extends BaseDiagramModelState implements JsonModelState<ClassDiagramSourceModel> {
    @inject(ClassDiagramModelIndex)
    declare index: ClassDiagramModelIndex;
    @inject(UmlDiagramLSPServices)
    readonly services: UmlDiagramLSPServices;

    protected _semanticUri: string;
    protected _semanticRoot: Diagram;
    protected _packageId: string;

    @inject(ActionDispatcher)
    protected readonly actionDispatcher!: ActionDispatcher;

    setSemanticRoot(uri: string, semanticRoot: Diagram): void {
        this._semanticUri = uri;
        this._semanticRoot = semanticRoot;
        this._packageId = this.services.shared.workspace.PackageManager.getPackageIdByUri(URI.parse(uri));

        this.index.indexSemanticRoot(this.semanticRoot);
    }

    get semanticUri(): string {
        return this._semanticUri;
    }

    get semanticRoot(): Diagram {
        return this._semanticRoot;
    }

    get packageId(): string {
        return this._packageId;
    }

    get modelService(): ModelService {
        return this.services.shared.model.ModelService;
    }

    get semanticSerializer(): DiagramSerializer<Diagram> {
        return this.services.language.serializer.Serializer;
    }

    get nameProvider(): QualifiedNameProvider {
        return this.services.language.references.QualifiedNameProvider;
    }

    get sourceModel(): ClassDiagramSourceModel {
        return {
            text: this.semanticText()
        };
    }

    async replaceSemanticRoot(model: Diagram) {
        this._semanticRoot = model;
        this.index.indexSemanticRoot(this.semanticRoot);
    }

    async updateSemanticRoot(content?: string, doNotUpdateSemanticRoot?: boolean): Promise<void> {
        if (!doNotUpdateSemanticRoot) {
            this._semanticRoot = await this.modelService.update(this.semanticUri, content ?? this.semanticRoot, 'glsp');
        }

        this.index.indexSemanticRoot(this.semanticRoot);
    }

    async sendModelPatch(patch: string): Promise<void> {
        try {
            this._semanticRoot = await this.modelService.patch(this.semanticUri, patch, 'glsp');
            this.index.indexSemanticRoot(this.semanticRoot);
        } catch (ex: unknown) {
            const message = ex instanceof Error ? ex.message : String(ex);

            this.actionDispatcher.dispatch(MessageAction.create(message, { severity: 'ERROR' as SeverityLevel }));
        }
    }

    async updateSourceModel(sourceModel: ClassDiagramSourceModel, doNotUpdateSemanticRoot?: boolean): Promise<void> {
        if (!doNotUpdateSemanticRoot) {
            this._semanticRoot = await this.modelService.update<Diagram>(this.semanticUri, sourceModel.text ?? this.semanticRoot, 'glsp');
        }

        this.index.indexSemanticRoot(this.semanticRoot);
    }

    /** Textual representation of the current semantic root. */
    semanticText(): string {
        return this.services.language.serializer.Serializer.serialize(this.semanticRoot);
    }

    async undo() {
        this._semanticRoot = await this.modelService.undo(this.semanticUri);
        this.index.indexSemanticRoot(this.semanticRoot);
    }
    async redo() {
        this._semanticRoot = await this.modelService.redo(this.semanticUri);
        this.index.indexSemanticRoot(this.semanticRoot);
    }
}
