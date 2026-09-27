/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Module } from 'langium';
import { type LangiumSharedServices } from 'langium/lsp';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { type ExtendedServiceRegistry } from '../langium/extended-services.js';
import { OpenTextDocumentManager } from './document/open-text-document-manager.js';
import { OpenableTextDocuments } from './document/openable-text-documents.js';
import { ModelService } from './model-service.js';
import { PatchManager } from './patch/patch-manager.js';

/**
 * The services that make the language a model server: the facade non-LSP clients such as the diagram
 * go through, and the document bookkeeping that keeps them and the text editor in step.
 */
export interface AddedSharedModelServices {
    workspace: {
        /** Langium's text document store, made openable from inside the server. */
        TextDocuments: OpenableTextDocuments<TextDocument>;
        /** Which client holds which document at which version. */
        TextDocumentManager: OpenTextDocumentManager;
    };
    model: {
        /** Access to the semantic models without being a language client. */
        ModelService: ModelService;
    };
}

export type ModelServerSharedServices = Omit<LangiumSharedServices, 'ServiceRegistry'> & {
    ServiceRegistry: ExtendedServiceRegistry;
} & AddedSharedModelServices;

/** @deprecated Use {@link ModelServerSharedServices}. */
export type SharedServices = ModelServerSharedServices;

/** Composed into the shared services by the language's module. */
export const ModelServerSharedModule: Module<ModelServerSharedServices, AddedSharedModelServices> = {
    workspace: {
        TextDocuments: () => new OpenableTextDocuments(TextDocument),
        TextDocumentManager: services => new OpenTextDocumentManager(services)
    },
    model: {
        ModelService: services => new ModelService(services, new PatchManager(services))
    }
};
