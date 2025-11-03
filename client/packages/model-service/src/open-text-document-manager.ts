/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import * as fs from "fs";
import {
  AstNode,
  DocumentBuilder,
  DocumentState,
  FileSystemProvider,
  LangiumDefaultSharedServices,
  LangiumDocuments,
} from "langium";
import { Connection, Disposable, WorkspaceChange } from "vscode-languageserver";
import {
  TextDocumentIdentifier,
  TextDocumentItem,
  VersionedTextDocumentIdentifier,
} from "vscode-languageserver-protocol";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { AddedSharedModelServices } from "./model-module.js";
import { OpenableTextDocuments } from "./openable-text-documents.js";

/** register client ids that will interact with the model service  */
const clientIds = ["text", "glsp"];

export type OpenDocumentKey = {
  uri: string;
  client: string;
};

export type OpenDocumentValue = {
  version: number;
  text: string;
};

export class ModelServerOpenDocuments {
  private map: Map<string, OpenDocumentValue>;

  constructor() {
    this.map = new Map<string, OpenDocumentValue>();
  }

  keys() {
    return this.map.keys();
  }

  set(key: OpenDocumentKey, item: OpenDocumentValue) {
    this.map.set(this.hashFunction(key), item);
  }

  get(key: OpenDocumentKey) {
    return this.map.get(this.hashFunction(key));
  }

  includes(key: OpenDocumentKey) {
    return this.map.has(this.hashFunction(key));
  }

  delete(key: OpenDocumentKey) {
    this.map.delete(this.hashFunction(key));
  }

  private hashFunction(keyObject: OpenDocumentKey): string {
    return JSON.stringify(keyObject);
  }
}
/**
 * A manager class that suppors handling documents with a simple open-update-save/close lifecycle.
 *
 * The manager wraps the services exposed by Langium and acts as a small language client on behalf of the caller.
 */
export class OpenTextDocumentManager {
  protected textDocuments: OpenableTextDocuments<TextDocument>;
  protected fileSystemProvider: FileSystemProvider;
  protected connection: Connection;
  protected documentBuilder: DocumentBuilder;
  protected langiumDocs: LangiumDocuments;

  // normalized URIs and clients of open documents mapped to their version and semantic text
  protected openDocuments: ModelServerOpenDocuments;

  constructor(services: AddedSharedModelServices & LangiumDefaultSharedServices) {
    this.documentBuilder = services.workspace.DocumentBuilder;
    this.textDocuments = services.workspace.TextDocuments;
    this.fileSystemProvider = services.workspace.FileSystemProvider;
    this.connection = services.lsp.Connection!;
    this.langiumDocs = services.workspace.LangiumDocuments;
    this.openDocuments = new ModelServerOpenDocuments();
    this.textDocuments.onDidOpen((event) => {
      console.log("text document open event");
      this.open(event.document.uri, event.document.languageId);
    });
    this.textDocuments.onDidClose((event) => {
      console.log("text document close event");
      this.close(event.document.uri);
    });
    this.textDocuments.onDidChangeContent((event) => {
      console.log("text document did change content event");
      this.update(event.document.uri, event.document.version, event.document.getText());
    });
  }

  /**
   * Opens the document with the given URI for modification.
   *
   * @param uri document URI
   * @param client client name that sent the request
   */
  async open(uri: string, languageId?: string, client?: string): Promise<void> {
    if (this.isOpen(uri, client)) {
      return;
    }
    const textDocument = await this.readFromFilesystem(uri, languageId);
    this.openDocuments.set(
      { uri: this.normalizedUri(uri), client: client ?? "text" },
      { version: textDocument.version, text: textDocument.text }
    );
    this.textDocuments.notifyDidOpenTextDocument({ textDocument }, client);

    // update text editor content if document was already
    // edited with another client, replace content
    const version = this.getNewestDocumentVersion(uri);
    if (!client && version > textDocument.version) {
      const currentDocument = this.getNewestNonTextEditorOpenDocument(uri);
      if (currentDocument) {
        // update the text editor as many times as the current version of the open GLSP editor
        // to get the text document versions in sync
        let numberOfIt = currentDocument.version - textDocument.version;
        for (let i = 1; i <= numberOfIt + 1; i++) {
          await this.replaceTextEditorContent(uri, currentDocument.text);
          // have to modify the context with every update as otherwise the
          // notifyDidChangeTextDocument() won't trigger
          if (i % 2 === 0) {
            await this.replaceTextEditorContent(uri, currentDocument.text + "\n");
          } else {
            await this.replaceTextEditorContent(uri, currentDocument.text);
          }
        }
      }
    }
  }

  /**
   * Closes the document with the given URI for modification.
   *
   * @param uri document URI
   * @param client client name that sent the request
   */
  async close(uri: string, client?: string): Promise<void> {
    if (!this.isOpen(uri, client)) {
      return;
    }
    this.removeFromOpenedDocuments(uri, client);
    if (this.isOpenWithAnyClient(uri)) {
      return;
    }
    this.textDocuments.notifyDidCloseTextDocument({ textDocument: TextDocumentIdentifier.create(uri) }, true);
  }

  /**
   * Updates the semantic model stored in the document with the given model
   * or textual representation of a model.
   * Any previous content will be overridden.
   * If the document was not already open for modification, it throws an error.
   * If the request is coming from a non-LSP client, the content of an open text editor
   * with the given document will be overwritten.
   *
   * @param uri document URI
   * @param model semantic model or textual representation of it
   * @returns the stored semantic model
   */
  async update(uri: string, version: number, text: string, client?: string): Promise<void> {
    if (!this.isOpen(uri, client)) {
      throw new Error(`Document ${uri} hasn't been opened for updating yet`);
    }

    this.openDocuments.set({ uri: this.normalizedUri(uri), client: client ?? "text" }, { version, text });

    if (client && client !== "text") {
      let textDocument = this.openDocuments.get({
        uri: this.normalizedUri(uri),
        client: "text",
      });
      let clientDocument = this.openDocuments.get({
        uri: this.normalizedUri(uri),
        client,
      });

      // update the version of the LangiumDocument if update was not coming
      // from the LSP, otherwise it is already updated
      if (
        (!textDocument && clientDocument) ||
        (textDocument && clientDocument && clientDocument.version > textDocument.version)
      ) {
        this.textDocuments.notifyDidChangeTextDocument(
          {
            textDocument: VersionedTextDocumentIdentifier.create(this.normalizedUri(uri), clientDocument.version),
            contentChanges: [{ text }],
          },
          client
        );
        // replace the content of an open text editor with the given update
        if (textDocument && clientDocument && clientDocument.version > textDocument.version) {
          await this.replaceTextEditorContent(uri, text);
        }
      }
    }
  }

  /**
   * Overrides the document with the given URI with the given semantic model or text.
   *
   * @param uri document uri
   * @param model semantic model or text
   */
  async save(uri: string, text: string): Promise<void> {
    const vscUri = URI.parse(uri);
    fs.writeFileSync(vscUri.fsPath, text);
    this.textDocuments.notifyDidSaveTextDocument({
      textDocument: TextDocumentIdentifier.create(uri),
    });
  }

  /**
   * Subscribes to the 'Validated' state of Langium's document builder.
   *
   * @param uri Uri of the document to listen to. The callback only gets
   * called when this URI and the URI of the saved document are equal.
   * @param client the requesting client
   * @param listener Callback to be called
   * @returns Disposable object
   */
  onUpdate<T extends AstNode>(uri: string, client: string, listener: (model: T) => void): Disposable {
    return this.documentBuilder.onBuildPhase(DocumentState.Validated, (allChangedDocuments, _token) => {
      const changedDocument = allChangedDocuments.find(
        (document) => document.uri.toString() === this.normalizedUri(uri)
      );
      if (changedDocument) {
        const textDocumentVersion = this.getClientDocumentVersion(this.normalizedUri(uri), "text");
        const clientDocumentVersion = this.getClientDocumentVersion(this.normalizedUri(uri), client);
        // only trigger listener is update is coming from text editor
        if (clientDocumentVersion && textDocumentVersion > clientDocumentVersion) {
          if (
            !changedDocument.diagnostics ||
            (changedDocument.diagnostics.length === 0 && changedDocument.parseResult.parserErrors.length === 0) ||
            changedDocument.diagnostics.filter((value) => value.data.code === "linking-error").length ===
              changedDocument.diagnostics.length
          ) {
            const root = changedDocument.parseResult.value;
            return listener(root as T);
          }
        }
      }
    });
  }

  /**
   * Generates a workspace edit and applies it to replace
   * the content of an open text editor
   * @param uri the uri of the open file
   * @param text the text that the current content will be replaced with
   */
  private async replaceTextEditorContent(uri: string, text: string) {
    let workspaceChange = new WorkspaceChange();
    let textChange = workspaceChange.getTextEditChange(uri);
    textChange.replace(
      {
        start: { line: 0, character: 0 },
        end: {
          line: Number.MAX_SAFE_INTEGER,
          character: Number.MAX_SAFE_INTEGER,
        },
      },
      text
    );
    await this.connection.workspace.applyEdit(workspaceChange.edit);
  }

  /**
   * Get the open document version for a given client
   * @param uri document uri
   * @param client client name that sent the request
   */
  getClientDocumentVersion(uri: string, client: string): number {
    const textDocument = this.openDocuments.get({
      uri: this.normalizedUri(uri),
      client,
    });
    return textDocument?.version ?? 0;
  }

  /**
   * Get the latest open document version for a non-LSP client.
   * Use to determine whether the update was coming from the text editor
   * or a non-LSP client.
   * @param uri document uri
   */
  getNewestNonTextEditorOpenDocument(uri: string): OpenDocumentValue | undefined {
    let newestNonTextVersion = 0;
    let newestNonTextDocument: OpenDocumentValue | undefined;
    for (let client of clientIds) {
      if (client !== "text") {
        const textDocument = this.openDocuments.get({
          uri: this.normalizedUri(uri),
          client: client,
        });
        if (textDocument?.version && newestNonTextVersion < textDocument.version) {
          newestNonTextVersion = textDocument.version;
          newestNonTextDocument = textDocument;
        }
      }
    }
    return newestNonTextDocument;
  }

  /**
   * Get the newest open version of the document across all the registered clients
   */
  getNewestDocumentVersion(uri: string): number {
    let version = 1;
    for (let clientId of clientIds) {
      const doc = this.openDocuments.get({
        uri: this.normalizedUri(uri),
        client: clientId,
      });
      if (doc && doc.version > version) {
        version = doc.version;
      }
    }
    return version;
  }

  /**
   * Checks if the document is open with the given client
   */
  protected isOpen(uri: string, client?: string): boolean {
    return this.openDocuments.includes({
      uri: this.normalizedUri(uri),
      client: client ?? "text",
    });
  }

  /**
   * Checks if the document is open with any client
   * @param client client name that sent the request
   */
  protected isOpenWithAnyClient(uri: string): boolean {
    for (let clientId of clientIds) {
      if (
        this.openDocuments.includes({
          uri: this.normalizedUri(uri),
          client: clientId,
        })
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes an open document if a client closed it.
   * @param client client name that sent the request
   */
  protected removeFromOpenedDocuments(uri: string, client?: string): void {
    this.openDocuments.delete({
      uri: this.normalizedUri(uri),
      client: client ?? "text",
    });
  }

  protected async readFromFilesystem(uri: string, languageId = "workflow"): Promise<TextDocumentItem> {
    const vscUri = URI.parse(uri);
    const content = this.fileSystemProvider.readFileSync(vscUri);
    return TextDocumentItem.create(vscUri.toString(), languageId, 1, content.toString());
  }

  protected normalizedUri(uri: string): string {
    return URI.parse(uri).toString();
  }
}
