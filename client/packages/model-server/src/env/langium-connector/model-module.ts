/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type AstNode, DefaultServiceRegistry, type JsonSerializer, type LangiumServices, type LangiumSharedServices } from 'langium';
import { type TextDocument } from 'vscode-languageserver-textdocument';
import { type URI } from 'vscode-uri';
import { type ModelService } from './model-service.js';
import { type OpenTextDocumentManager } from './open-text-document-manager.js';
import { type OpenableTextDocuments } from './openable-text-documents.js';
import { type Serializer } from './serializer.js';

/***************************
 * Shared Module
 ***************************/
export interface ExtendedLangiumServices extends LangiumServices {
    serializer: {
        JsonSerializer: JsonSerializer;
        Serializer: Serializer<AstNode>;
    };
}

export class ExtendedServiceRegistry extends DefaultServiceRegistry {
    override register(language: ExtendedLangiumServices): void {
        super.register(language);
    }

    override getServices(uri: URI): ExtendedLangiumServices {
        return super.getServices(uri) as ExtendedLangiumServices;
    }
}

export type AddedSharedServices = {
    ServiceRegistry: ExtendedServiceRegistry;
};

export const SharedServices = Symbol('SharedServices');
export type SharedServices = Omit<LangiumSharedServices, 'ServiceRegistry'> & AddedSharedServices & AddedSharedModelServices;

/**
 * Extension to the default shared model services by Langium.
 */
export interface AddedSharedModelServices {
    workspace: {
        /* override */ TextDocuments: OpenableTextDocuments<TextDocument>; // more accessible text document store
        TextDocumentManager: OpenTextDocumentManager; // open text document facade used by the model service
    };
    model: {
        ModelService: ModelService; // facade to access the Langium semantic models without being a language client
    };
}
