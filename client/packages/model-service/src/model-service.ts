/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import * as jsonpatch from "fast-json-patch";
import { AstNode, isAstNode } from "langium";
import { Disposable } from "vscode-languageserver";
import { URI } from "vscode-uri";
import { ExtendedLangiumServices, SharedServices } from "./model-module.js";
import { PatchManager } from "./patch-manager.js";

/**
 * The model service serves as a facade to access and update semantic models from the language server as a non-LSP client.
 * It provides a simple open-request-update-save/close lifecycle for documents and their semantic model.
 */
export class ModelService {
  constructor(
    protected shared: SharedServices,
    protected documentManager = shared.workspace.TextDocumentManager,
    protected documents = shared.workspace.LangiumDocuments,
    protected documentBuilder = shared.workspace.DocumentBuilder,
    protected indexManager = shared.workspace.IndexManager,
    protected patchManager = new PatchManager(shared)
  ) {}

  /**
   * Opens the document with the given URI for modification.
   *
   * @param uri document URI
   */
  open(uri: string): Promise<void>;
  /**
   * Opens the document with the given URI for modification.
   *
   * @param uri document URI
   * @param client client name that sent the request
   */
  open(uri: string, client: string): Promise<void>;
  async open(uri: string, client?: string): Promise<void> {
    return await this.documentManager.open(uri, undefined, client);
  }

  /**
   * Closes the document with the given URI for modification.
   *
   * @param uri document URI
   * @param client client name that sent the request
   */
  async close(uri: string, client?: string): Promise<void> {
    return this.documentManager.close(uri, client);
  }

  /**
   * Requests the semantic model stored in the document with the given URI.
   * If the document was not already open for modification, it will be opened automatically.
   *
   * @param uri document URI
   */
  request(uri: string): Promise<AstNode | undefined>;
  /**
   * Requests the semantic model stored in the document with the given URI if it matches the given guard function.
   * If the document was not already open for modification, it will be opened automatically.
   *
   * @param uri document URI
   * @param client the name of the client that sent the request
   * @param guard guard function to ensure a certain type of semantic model
   */
  request<T extends AstNode>(uri: string, guard: (item: unknown) => item is T, client: string): Promise<T | undefined>;
  /**
   * Requests the semantic model stored in the document with the given URI if it matches the given guard function.
   * If the document was not already open for modification, it will be opened automatically.
   *
   * @param uri document URI
   * @param guard guard function to ensure a certain type of semantic model
   */
  request<T extends AstNode>(uri: string, guard: (item: unknown) => item is T): Promise<T | undefined>;
  async request<T extends AstNode>(
    uri: string,
    guard?: (item: unknown) => item is T,
    client?: string
  ): Promise<AstNode | T | undefined> {
    if (client) {
      await this.open(uri, client);
    } else {
      await this.open(uri);
    }
    // request the document from LangiumDocuments to deliver the AST
    const document = this.documents.getOrCreateDocument(URI.parse(uri));
    const root = document.parseResult.value;
    const check = guard ?? isAstNode;
    return check(root) ? root : undefined;
  }

  getLanguageSpecificServices(uri: string): ExtendedLangiumServices {
    return this.shared.ServiceRegistry.getServices(URI.parse(uri));
  }

  async getCrossReferences(uri: string, ref: string): Promise<{ references: AstNode[] } | undefined> {
    await this.open(uri);
    const document = this.documents.getOrCreateDocument(URI.parse(uri));
    await this.indexManager.updateReferences(document);

    const references: AstNode[] = [];
    document.references.forEach((reference) => {
      if (reference.$nodeDescription?.name === ref) {
        if (reference.$refNode) {
          references.push(reference.$refNode.element);
        }
      }
    });
    return { references };
  }

  async test(uri: string): Promise<string> {
    await this.open(uri);
    const document = this.documents.getOrCreateDocument(URI.parse(uri));
    const jsonSerializer = this.shared.ServiceRegistry.getServices(URI.parse(uri)).serializer.JsonSerializer;
    await this.close(uri);
    return jsonSerializer.serialize(document.parseResult.value);
  }

  async patch<T extends AstNode>(
    uri: string,
    patchOp: string | jsonpatch.Operation | Array<jsonpatch.Operation>,
    client?: string
  ) {
    console.log("[ModelService] PATCH", { patchOp, client });
    const patch = typeof patchOp === "string" ? JSON.parse(patchOp) : patchOp;
    return (await this.patchManager.applyPatch(patch, uri, client)) as T;
  }

  async redo<T extends AstNode>(uri: string): Promise<T> {
    return (await this.patchManager.redo(uri)) as T;
  }

  async undo<T extends AstNode>(uri: string): Promise<T> {
    return (await this.patchManager.undo(uri)) as T;
  }

  /**
   * Updates the semantic model stored in the document with the given model or textual representation of a model.
   * Any previous content will be overridden.
   * If the document was not already open for modification, it will be opened automatically.
   *
   * @param uri document URI
   * @param model semantic model or textual representation of it
   * @returns the stored semantic model
   */
  async update<T extends AstNode>(uri: string, model: T | string, client?: string): Promise<T> {
    if (client) {
      await this.open(uri, client);
    } else {
      await this.open(uri);
    }
    // get the current LangiumDocument
    const document = this.documents.getOrCreateDocument(URI.parse(uri));
    const root = document.parseResult.value;
    if (!isAstNode(root)) {
      throw new Error(`No AST node to update exists in '${uri}'`);
    }

    // serialize updated AST if AST is provided
    const text = typeof model === "string" ? model : this.serialize(URI.parse(uri), model);

    const version = this.documentManager.getClientDocumentVersion(uri, client ?? "text");
    // if text editor triggered changes on non-text editors, update non-text editor version to match text-editor version
    if (client !== "text" && version < this.documentManager.getClientDocumentVersion(uri, "text")) {
      if (
        !document.diagnostics ||
        (document.diagnostics.length === 0 && document.parseResult.parserErrors.length === 0) ||
        document.diagnostics.filter((value) => value.data.code === "linking-error").length ===
          document.diagnostics.length
      ) {
        await this.documentManager.update(
          uri,
          this.documentManager.getClientDocumentVersion(uri, "text"),
          text,
          client
        );
      } else {
        // if current LangiumDocument has errors, return empty model
        // that means for the client that there are errors in the document
        // in the text editor, and cannot be modified
        return {} as T;
      }
    } else {
      // update LangiumDocument to send back to client
      this.shared.workspace.TextDocuments.update(document.textDocument, text, version);
      await this.documentManager.update(uri, document.textDocument.version + 1, text, client);
      await this.documentBuilder.update([URI.parse(uri)], []);
    }

    return document.parseResult.value as T;
  }

  /**
   * Listenes to updates coming from the language server.
   * @param uri document uri
   * @param listener listener function
   * @returns disposable, that fires on update
   */
  onUpdate<T extends AstNode>(uri: string, client: string, listener: (model: T) => void): Disposable {
    return this.documentManager.onUpdate(uri, client, listener);
  }

  /**
   * Overrides the document with the given URI with the given semantic model or text.
   *
   * @param uri document uri
   * @param model semantic model or text
   */
  async save(uri: string, model: AstNode | string, client?: string): Promise<void> {
    if (model) {
      const text = typeof model === "string" ? model : this.serialize(URI.parse(uri), model);
      return this.documentManager.save(uri, text);
    } else {
      if (client) {
        await this.open(uri, client);
      } else {
        await this.open(uri);
      }
      const document = this.documents.getOrCreateDocument(URI.parse(uri));
      return this.documentManager.save(uri, document.textDocument.getText());
    }
  }

  /**
   * Serializes the given semantic model by using the serializer service for the corresponding language.
   *
   * @param uri document uri
   * @param model semantic model
   */
  protected serialize(uri: URI, model: AstNode): string {
    const serializer = this.shared.ServiceRegistry.getServices(uri).serializer.Serializer;
    return serializer.serialize(model);
  }
}
