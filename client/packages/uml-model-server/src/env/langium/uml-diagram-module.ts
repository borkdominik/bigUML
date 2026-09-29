/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { UmlDiagramSerializer } from '@borkdominik-biguml/uml-model-server/gen/langium';
import { inject, type Module } from 'langium';
import {
    createDefaultModule,
    createDefaultSharedModule,
    type DefaultSharedModuleContext,
    type PartialLangiumServices,
    type PartialLangiumSharedServices
} from 'langium/lsp';
import { UmlDiagramGeneratedModule, UmlDiagramGeneratedSharedModule } from '../grammar.js';
import { ModelServerSharedModule, type ModelServerSharedServices } from '../langium-connector/model-module.js';
import { type ExtendedLangiumServices, ExtendedServiceRegistry } from './extended-services.js';
import { ClientLogger } from './uml-diagram-client-logger.js';
import { UmlDiagramCompletionProvider } from './uml-diagram-completion-provider.js';
import { UmlDiagramDocumentBuilder } from './uml-diagram-document-builder.js';
import { UmlDiagramModelFormatter } from './uml-diagram-formatter.js';
import { UmlDiagramJsonSerializer } from './uml-diagram-json-serializer.js';
import { UmlDiagramLangiumDocuments } from './uml-diagram-langium-documents.js';
import { QualifiedNameProvider } from './uml-diagram-naming.js';
import { UmlDiagramPackageManager } from './uml-diagram-package-manager.js';
import { UmlDiagramScopeProvider } from './uml-diagram-scope-provider.js';
import { UmlDiagramScopeComputation } from './uml-diagram-scope.js';
import { UmlDiagramTokenBuilder } from './uml-diagram-token-builder.js';
import { UmlDiagramValueConverter } from './uml-diagram-value-converter.js';
import { registerValidationChecks, UmlDiagramValidator } from './uml-diagram-validator.js';
import { UmlDiagramWorkspaceManager } from './uml-diagram-workspace-manager.js';

export type UmlDiagramAddedSharedServices = {
    workspace: {
        WorkspaceManager: UmlDiagramWorkspaceManager;
        PackageManager: UmlDiagramPackageManager;
    };
    logger: {
        ClientLogger: ClientLogger;
    };
};

export const UmlDiagramSharedServices = Symbol('UmlDiagramSharedServices');
export type UmlDiagramSharedServices = ModelServerSharedServices & UmlDiagramAddedSharedServices;

/** The language's own shared services. What makes it a model server is composed in separately, see `createUmlDiagramServices`. */
export const UmlDiagramSharedModule: Module<UmlDiagramSharedServices, PartialLangiumSharedServices & UmlDiagramAddedSharedServices> = {
    ServiceRegistry: () => new ExtendedServiceRegistry(),
    workspace: {
        WorkspaceManager: services => new UmlDiagramWorkspaceManager(services),
        PackageManager: services => new UmlDiagramPackageManager(services),
        LangiumDocuments: services => new UmlDiagramLangiumDocuments(services),
        DocumentBuilder: services => new UmlDiagramDocumentBuilder(services)
    },
    logger: {
        ClientLogger: services => new ClientLogger(services)
    }
};

export interface UmlDiagramModuleContext {
    shared: UmlDiagramSharedServices;
}

export interface UmlDiagramAddedServices {
    shared: UmlDiagramSharedServices;
    references: {
        QualifiedNameProvider: QualifiedNameProvider;
    };
    serializer: {
        Serializer: UmlDiagramSerializer;
    };
    validation: {
        UmlDiagramValidator: UmlDiagramValidator;
    };
}

export type UmlDiagramServices = ExtendedLangiumServices & UmlDiagramAddedServices;
export const UmlDiagramServices = Symbol('UmlDiagramServices');

export function createUmlDiagramModule(
    context: UmlDiagramModuleContext
): Module<UmlDiagramServices, PartialLangiumServices & UmlDiagramAddedServices> {
    return {
        references: {
            ScopeComputation: services => new UmlDiagramScopeComputation(services),
            ScopeProvider: services => new UmlDiagramScopeProvider(services),
            QualifiedNameProvider: services => new QualifiedNameProvider(services)
        },
        lsp: {
            CompletionProvider: services => new UmlDiagramCompletionProvider(services),
            Formatter: () => new UmlDiagramModelFormatter()
        },
        parser: {
            TokenBuilder: () => new UmlDiagramTokenBuilder(),
            ValueConverter: () => new UmlDiagramValueConverter()
        },
        serializer: {
            Serializer: services => new UmlDiagramSerializer(services),
            JsonSerializer: services => new UmlDiagramJsonSerializer(services)
        },
        shared: () => context.shared,
        validation: {
            UmlDiagramValidator: () => new UmlDiagramValidator()
        }
    };
}

/**
 * The composition root: Langium's defaults, the generated language, the language's own services and
 * the model server on top, wired into one shared container and one language container.
 */
export function createUmlDiagramServices(context: DefaultSharedModuleContext): {
    shared: UmlDiagramSharedServices;
    UmlDiagram: UmlDiagramServices;
} {
    const shared = inject(
        createDefaultSharedModule(context),
        UmlDiagramGeneratedSharedModule,
        UmlDiagramSharedModule,
        ModelServerSharedModule
    );
    const UmlDiagram = inject(createDefaultModule({ shared }), UmlDiagramGeneratedModule, createUmlDiagramModule({ shared }));
    shared.ServiceRegistry.register(UmlDiagram);
    registerValidationChecks(UmlDiagram);
    return { shared, UmlDiagram };
}
