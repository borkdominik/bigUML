import {
    createDefaultModule,
    createDefaultSharedModule,
    DefaultSharedModuleContext,
    inject,
    Module,
    PartialLangiumServices,
    PartialLangiumSharedServices
} from 'langium';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { ModelService, OpenableTextDocuments, OpenTextDocumentManager } from '../../src/vscode/index.js';
import {
    ExtendedServiceRegistry,
    type AddedSharedModelServices,
    type AddedSharedServices,
    type ExtendedLangiumServices,
    type SharedServices
} from '../../src/vscode/langium-connector/model-module.js';
import { UmlDiagramGeneratedModule, UmlDiagramGeneratedSharedModule } from './language/module.js';
import { ClientLogger } from './uml-diagram-client-logger.js';
import { UmlDiagramCompletionProvider } from './uml-diagram-completion-provider.js';
import { UmlDiagramDocumentBuilder } from './uml-diagram-document-builder.js';
import { UmlDiagramModelFormatter } from './uml-diagram-formatter.js';
import { UmlDiagramJsonSerializer } from './uml-diagram-json-serializer.js';
import { UmlDiagramLangiumDocumentFactory } from './uml-diagram-langium-document-factory.js';
import { UmlDiagramLangiumDocuments } from './uml-diagram-langium-documents.js';
import { QualifiedNameProvider } from './uml-diagram-naming.js';
import { UmlDiagramPackageManager } from './uml-diagram-package-manager.js';
import { UmlDiagramScopeProvider } from './uml-diagram-scope-provider.js';
import { UmlDiagramScopeComputation } from './uml-diagram-scope.js';
import { UmlDiagramSerializer } from './uml-diagram-serializer.js';
import { UmlDiagramValidator } from './uml-diagram-validator.js';
import { UmlDiagramWorkspaceManager } from './uml-diagram-workspace-manager.js';

/**
 * Declaration of custom services - add your own service classes here.
 */
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
export type UmlDiagramSharedServices = SharedServices & UmlDiagramAddedSharedServices;

export const UmlDiagramSharedModule: Module<
    UmlDiagramSharedServices,
    PartialLangiumSharedServices & UmlDiagramAddedSharedServices & AddedSharedServices & AddedSharedModelServices
> = {
    ServiceRegistry: () => new ExtendedServiceRegistry(),
    workspace: {
        WorkspaceManager: services => new UmlDiagramWorkspaceManager(services),
        PackageManager: services => new UmlDiagramPackageManager(services),
        LangiumDocumentFactory: services => new UmlDiagramLangiumDocumentFactory(services),
        LangiumDocuments: services => new UmlDiagramLangiumDocuments(services),
        TextDocuments: () => new OpenableTextDocuments(TextDocument),
        TextDocumentManager: services => new OpenTextDocumentManager(services),
        DocumentBuilder: services => new UmlDiagramDocumentBuilder(services)
    },
    logger: {
        ClientLogger: services => new ClientLogger(services)
    },
    model: {
        ModelService: services => new ModelService(services)
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
        UmlDiagramValidator: any;
    };
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type UmlDiagramServices = ExtendedLangiumServices & UmlDiagramAddedServices;
export const UmlDiagramServices = Symbol('UmlDiagramServices');

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
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
export function createUmlDiagramServices(context: DefaultSharedModuleContext): {
    shared: UmlDiagramSharedServices;
    UmlDiagram: UmlDiagramServices;
} {
    const shared = inject(createDefaultSharedModule(context), UmlDiagramGeneratedSharedModule, UmlDiagramSharedModule);
    const UmlDiagram = inject(createDefaultModule({ shared }), UmlDiagramGeneratedModule, createUmlDiagramModule({ shared }));
    shared.ServiceRegistry.register(UmlDiagram);
    return { shared, UmlDiagram };
}
