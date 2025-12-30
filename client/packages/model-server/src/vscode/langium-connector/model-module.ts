/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { AstNode, DefaultServiceRegistry, JsonSerializer, LangiumServices, LangiumSharedServices, ServiceRegistry } from 'langium';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import { ModelService } from './model-service.js';
import { OpenTextDocumentManager } from './open-text-document-manager.js';
import { OpenableTextDocuments } from './openable-text-documents.js';
import { Serializer } from './serializer.js';

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

export interface ExtendedServiceRegistry extends ServiceRegistry {
    register(language: ExtendedLangiumServices): void;
    getServices(uri: URI): ExtendedLangiumServices;
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
