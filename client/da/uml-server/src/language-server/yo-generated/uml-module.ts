/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    AddedSharedModelServices,
    AddedSharedServices,
    ExtendedLangiumServices,
    ExtendedServiceRegistry,
    ModelService,
    OpenTextDocumentManager,
    OpenableTextDocuments,
    SharedServices
} from '@borkdominik-biguml/model-service';
import {
    AstNode,
    DefaultSharedModuleContext,
    Module,
    PartialLangiumServices,
    PartialLangiumSharedServices,
    createDefaultModule,
    createDefaultSharedModule,
    inject
} from 'langium';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { UmlGeneratedModule, UmlGeneratedSharedModule } from '../generated/module.js';
import { ClientLogger } from './uml-client-logger.js';
import { UmlCompletionProvider } from './uml-completion-provider.js';
import { UmlDocumentBuilder } from './uml-document-builder.js';
import { UmlModelFormatter } from './uml-formatter.js';
import { UmlJsonSerializer } from './uml-json-serializer.js';
import { UmlLangiumDocumentFactory } from './uml-langium-document-factory.js';
import { UmlLangiumDocuments } from './uml-langium-documents.js';
import { QualifiedNameProvider } from './uml-naming.js';
import { UmlPackageManager } from './uml-package-manager.js';
import { UmlScopeProvider } from './uml-scope-provider.js';
import { UmlScopeComputation } from './uml-scope.js';
import { UmlSerializer } from './uml-serializer.js';
import { UmlWorkspaceManager } from './uml-workspace-manager.js';

import * as jsonpatch from 'fast-json-patch';
import { URI } from 'vscode-uri';
import { getNodeByPointer } from '../validation/json-pointer.js';
import { validateNode } from './validation/validator.js';

export class UmlModelService extends ModelService {
    override async patch<T extends AstNode>(
        uri: string,
        patchOp: string | jsonpatch.Operation | jsonpatch.Operation[],
        client?: string
    ): Promise<T> {
        const operations: jsonpatch.Operation[] = Array.isArray(patchOp)
            ? patchOp
            : typeof patchOp === 'string'
              ? (() => {
                    const parsed = JSON.parse(patchOp);
                    return Array.isArray(parsed) ? parsed : [parsed];
                })()
              : [patchOp];

        console.log('[patch] incoming operations', operations);

        await this.open(uri, client);
        const document = this.documents.getOrCreateDocument(URI.parse(uri));
        const root = document.parseResult.value;

        for (const op of operations) {
            console.log('[patch] validating op', op);

            if (op.op !== 'add' && op.op !== 'replace') {
                console.log('[patch] op skipped (no validation needed)');
                continue;
            }
            if (typeof op.path !== 'string') continue;

            const lastSlash = op.path.lastIndexOf('/');
            const parentPointer = lastSlash === 0 ? '/' : op.path.slice(0, lastSlash);
            const propOrIndex = op.path.slice(lastSlash + 1);

            const target = getNodeByPointer(root, parentPointer);

            if (!target) {
                console.warn('[patch] target not found in AST, letting patchManager handle it');
                continue;
            }

            const clone = Array.isArray(target) ? ([...target] as any) : ({ ...target } as any);

            if (Array.isArray(clone)) {
                const idx = Number(propOrIndex);
                if (op.op === 'replace') clone[idx] = op.value;
                else clone.splice(idx, 0, op.value);
            } else {
                clone[propOrIndex] = op.value;
            }

            try {
                validateNode(clone);
            } catch (e) {
                const msg = (e as Error).message ?? e;
                console.error('[patch] validation FAILED:', msg, '\n  ↳ op          :', op, '\n  ↳ parent      :', parentPointer);
                throw e;
            }
            console.log('[patch] validation OK ✔');
        }

        console.log('[patch] all operations validated, delegating to super.patch');
        const result = await super.patch(uri, operations, client);
        console.log('[patch] super.patch returned', result);

        return result as T;
    }
}

/**
 * Declaration of custom services - add your own service classes here.
 */
export interface UmlAddedSharedServices {
    workspace: {
        WorkspaceManager: UmlWorkspaceManager;
        PackageManager: UmlPackageManager;
    };
    logger: {
        ClientLogger: ClientLogger;
    };
}

export const UmlSharedServices = Symbol('UmlSharedServices');
export type UmlSharedServices = SharedServices & UmlAddedSharedServices;

export const UmlSharedModule: Module<
    UmlSharedServices,
    PartialLangiumSharedServices & UmlAddedSharedServices & AddedSharedServices & AddedSharedModelServices
> = {
    ServiceRegistry: () => new ExtendedServiceRegistry(),
    workspace: {
        WorkspaceManager: services => new UmlWorkspaceManager(services),
        PackageManager: services => new UmlPackageManager(services),
        LangiumDocumentFactory: services => new UmlLangiumDocumentFactory(services),
        LangiumDocuments: services => new UmlLangiumDocuments(services),
        TextDocuments: () => new OpenableTextDocuments(TextDocument),
        TextDocumentManager: services => new OpenTextDocumentManager(services),
        DocumentBuilder: services => new UmlDocumentBuilder(services)
    },
    logger: {
        ClientLogger: services => new ClientLogger(services)
    },
    model: {
        ModelService: services => new UmlModelService(services)
    }
};

export interface UmlModuleContext {
    shared: UmlSharedServices;
}
export interface UmlAddedServices {
    shared: UmlSharedServices;
    references: {
        QualifiedNameProvider: QualifiedNameProvider;
    };
    serializer: {
        Serializer: UmlSerializer;
    };
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type UmlServices = ExtendedLangiumServices & UmlAddedServices;
export const UmlServices = Symbol('UmlServices');

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export function createUmlModule(context: UmlModuleContext): Module<UmlServices, PartialLangiumServices & UmlAddedServices> {
    return {
        references: {
            ScopeComputation: services => new UmlScopeComputation(services),
            ScopeProvider: services => new UmlScopeProvider(services),
            QualifiedNameProvider: services => new QualifiedNameProvider(services)
        },
        lsp: {
            CompletionProvider: services => new UmlCompletionProvider(services),
            Formatter: () => new UmlModelFormatter()
        },
        serializer: {
            Serializer: services => new UmlSerializer(services),
            JsonSerializer: services => new UmlJsonSerializer(services)
        },
        shared: () => context.shared
    };
}

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createUmlServices(context: DefaultSharedModuleContext): {
    shared: UmlSharedServices;
    Uml: UmlServices;
} {
    const shared = inject(createDefaultSharedModule(context), UmlGeneratedSharedModule, UmlSharedModule);
    const Uml = inject(createDefaultModule({ shared }), UmlGeneratedModule, createUmlModule({ shared }));
    shared.ServiceRegistry.register(Uml);
    return { shared, Uml };
}
