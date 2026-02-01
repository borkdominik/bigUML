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

import { type Diagram, isDiagram } from '@borkdominik-biguml/model-server/grammar';
import {
    ActionDispatcher,
    type ClientSession,
    type ClientSessionListener,
    ClientSessionManager,
    GLSPServerError,
    Logger,
    type MaybePromise,
    type RequestModelAction,
    SOURCE_URI_ARG,
    type SaveModelAction,
    type SourceModelStorage
} from '@eclipse-glsp/server';
import { inject, injectable, postConstruct } from 'inversify';
import { findRootNode, streamReferences } from 'langium';
import { ClassDiagramModelState } from './class-diagram-model-state.js';

@injectable()
export class ClassDiagramModelStorage implements SourceModelStorage, ClientSessionListener {
    @inject(Logger) protected logger: Logger;
    @inject(ClassDiagramModelState) protected state: ClassDiagramModelState;
    @inject(ClientSessionManager) protected sessionManager: ClientSessionManager;
    @inject(ActionDispatcher) protected actionDispatcher: ActionDispatcher;

    @postConstruct()
    protected init(): void {
        this.sessionManager.addListener(this, this.state.clientId);
    }

    async loadSourceModel(action: RequestModelAction): Promise<void> {
        // load semantic model from document in language model service
        const sourceUri = this.getSourceUri(action);
        const rootUri = sourceUri;
        const root = await this.state.modelService.request(rootUri, isDiagram, 'glsp');
        if (!root) {
            throw new GLSPServerError('Expected BigUML Diagram Root');
        }
        this.state.setSemanticRoot(rootUri, root);
        this.state.modelService.onUpdate(this.state.semanticUri, this.state.clientId, async (newModel: Diagram) => {
            await this.state.replaceSemanticRoot(newModel);
        });
    }

    saveSourceModel(action: SaveModelAction): MaybePromise<void> {
        const saveUri = this.getFileUri(action);

        // save document and all related documents
        this.state.modelService.save(saveUri, this.state.semanticRoot);
        streamReferences(this.state.semanticRoot)
            .map(refInfo => refInfo.reference.ref)
            .nonNullable()
            .map(ref => findRootNode(ref))
            .forEach(root => this.state.modelService.save(root.$document!.uri.toString(), root));
    }

    sessionDisposed(_clientSession: ClientSession): void {
        // close loaded document for modification
        this.state.modelService.close(this.state.semanticUri, 'glsp');
    }

    protected getSourceUri(action: RequestModelAction): string {
        const sourceUri = action.options?.[SOURCE_URI_ARG];
        if (typeof sourceUri !== 'string') {
            throw new GLSPServerError(`Invalid RequestModelAction! Missing argument with key '${SOURCE_URI_ARG}'`);
        }
        return sourceUri;
    }

    protected getFileUri(action: SaveModelAction): string {
        const uri = action.fileUri ?? this.state.get(SOURCE_URI_ARG);
        if (!uri) {
            throw new GLSPServerError('Could not derive fileUri for saving the current source model');
        }
        return uri;
    }
}
