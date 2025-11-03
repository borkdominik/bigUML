import {
  AddedSharedModelServices,
  ExtendedLangiumServices,
  ExtendedServiceRegistry,
  ModelService,
  OpenableTextDocuments,
  OpenTextDocumentManager,
  SharedServices,
  AddedSharedServices
} from "@borkdominik-biguml/model-service";
import {
  createDefaultModule,
  createDefaultSharedModule,
  DefaultSharedModuleContext,
  inject,
  Module,
  PartialLangiumServices,
  PartialLangiumSharedServices,
} from "langium";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  <%= LanguageName %>GeneratedModule,
  <%= LanguageName %>GeneratedSharedModule,
} from "../generated/module.js";
import { ClientLogger } from "./<%= language-id %>-client-logger.js";
import { <%= LanguageName %>CompletionProvider } from "./<%= language-id %>-completion-provider.js";
import { <%= LanguageName %>DocumentBuilder } from "./<%= language-id %>-document-builder.js";
import { <%= LanguageName %>ModelFormatter } from "./<%= language-id %>-formatter.js";
import { <%= LanguageName %>JsonSerializer } from "./<%= language-id %>-json-serializer.js";
import { <%= LanguageName %>LangiumDocumentFactory } from "./<%= language-id %>-langium-document-factory.js";
import { <%= LanguageName %>LangiumDocuments } from "./<%= language-id %>-langium-documents.js";
import { QualifiedNameProvider } from "./<%= language-id %>-naming.js";
import { <%= LanguageName %>PackageManager } from "./<%= language-id %>-package-manager.js";
import { <%= LanguageName %>ScopeComputation } from "./<%= language-id %>-scope.js";
import { <%= LanguageName %>ScopeProvider } from "./<%= language-id %>-scope-provider.js";
import { <%= LanguageName %>Serializer } from "./<%= language-id %>-serializer.js";
import { <%= LanguageName %>WorkspaceManager } from "./<%= language-id %>-workspace-manager.js";

/**
 * Declaration of custom services - add your own service classes here.
 */
export type <%= LanguageName %>AddedSharedServices = {
  workspace: {
    WorkspaceManager: <%= LanguageName %>WorkspaceManager;
    PackageManager: <%= LanguageName %>PackageManager;
  };
  logger: {
    ClientLogger: ClientLogger;
  };
};

export const <%= LanguageName %>SharedServices = Symbol(
  "<%= LanguageName %>SharedServices"
);
export type <%= LanguageName %>SharedServices = SharedServices &
  <%= LanguageName %>AddedSharedServices;

export const <%= LanguageName %>SharedModule: Module<
  <%= LanguageName %>SharedServices,
  PartialLangiumSharedServices &
    <%= LanguageName %>AddedSharedServices &
    AddedSharedServices &
    AddedSharedModelServices
> = {
  ServiceRegistry: () => new ExtendedServiceRegistry(),
  workspace: {
    WorkspaceManager: (services) =>
      new <%= LanguageName %>WorkspaceManager(services),
    PackageManager: (services) => new <%= LanguageName %>PackageManager(services),
    LangiumDocumentFactory: (services) =>
      new <%= LanguageName %>LangiumDocumentFactory(services),
    LangiumDocuments: (services) =>
      new <%= LanguageName %>LangiumDocuments(services),
    TextDocuments: () => new OpenableTextDocuments(TextDocument),
    TextDocumentManager: (services) => new OpenTextDocumentManager(services),
    DocumentBuilder: (services) => new <%= LanguageName %>DocumentBuilder(services),
  },
  logger: {
    ClientLogger: (services) => new ClientLogger(services),
  },
  model: {
    ModelService: (services) => new ModelService(services),
  },
};

export interface <%= LanguageName %>ModuleContext {
  shared: <%= LanguageName %>SharedServices;
}
export interface <%= LanguageName %>AddedServices {
  shared: <%= LanguageName %>SharedServices;
  references: {
    QualifiedNameProvider: QualifiedNameProvider;
  };
  serializer: {
    Serializer: <%= LanguageName %>Serializer;
  };
  validation: {
    <%= LanguageName %>Validator: any;
  }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type <%= LanguageName %>Services = ExtendedLangiumServices &
  <%= LanguageName %>AddedServices;
export const <%= LanguageName %>Services = Symbol("<%= LanguageName %>Services");

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export function create<%= LanguageName %>Module(
  context: <%= LanguageName %>ModuleContext
): Module<
  <%= LanguageName %>Services,
  PartialLangiumServices & <%= LanguageName %>AddedServices
> {
  return {
    references: {
      ScopeComputation: (services) =>
        new <%= LanguageName %>ScopeComputation(services),
      ScopeProvider: (services) => new <%= LanguageName %>ScopeProvider(services),
      QualifiedNameProvider: (services) => new QualifiedNameProvider(services),
    },
    lsp: {
      CompletionProvider: (services) =>
        new <%= LanguageName %>CompletionProvider(services),
      Formatter: () => new <%= LanguageName %>ModelFormatter(),
    },
    serializer: {
      Serializer: (services) => new <%= LanguageName %>Serializer(services),
      JsonSerializer: (services) => new <%= LanguageName %>JsonSerializer(services),
    },
    shared: () => context.shared,
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
export function create<%= LanguageName %>Services(
  context: DefaultSharedModuleContext
): {
  shared: <%= LanguageName %>SharedServices;
  <%= LanguageName %>: <%= LanguageName %>Services;
} {
  const shared = inject(
    createDefaultSharedModule(context),
    <%= LanguageName %>GeneratedSharedModule,
    <%= LanguageName %>SharedModule
  );
  const <%= LanguageName %> = inject(
    createDefaultModule({ shared }),
    <%= LanguageName %>GeneratedModule,
    create<%= LanguageName %>Module({ shared })
  );
  shared.ServiceRegistry.register(<%= LanguageName %>);
  return { shared, <%= LanguageName %> };
}

