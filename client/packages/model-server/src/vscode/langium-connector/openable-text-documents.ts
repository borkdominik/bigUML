/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation and EclipseSource. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
  CancellationToken,
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
  DidOpenTextDocumentParams,
  DidSaveTextDocumentParams,
  Disposable,
  DocumentUri,
  Emitter,
  HandlerResult,
  RequestHandler,
  TextDocumentChangeEvent,
  TextDocuments,
  TextDocumentsConfiguration,
  TextDocumentSyncKind,
  TextDocumentWillSaveEvent,
  TextEdit,
  WillSaveTextDocumentParams,
} from "vscode-languageserver";

/**
 * This subclass of `TextDocuments` is actually entirely equivalent to `TextDocuments` but opens up
 * methods to be able to invoke events from within the language server (see json-server.ts).
 *
 * Otherwise the document will be read all the time from the disk
 * langium/src/workspace/documents.ts:222 which relies on _syncedDocuments to be open
 * vscode-languageserver/lib/common/textDocuments.js:119
 */
export class OpenableTextDocuments<
  T extends {
    version: number;
    uri: DocumentUri;
  }
> extends TextDocuments<T> {
  public constructor(protected configuration: TextDocumentsConfiguration<T>) {
    super(configuration);
  }

  protected get __syncedDocuments(): Map<string, T> {
    return this["_syncedDocuments"];
  }

  protected get __onDidChangeContent(): Emitter<TextDocumentChangeEvent<T>> {
    return this["_onDidChangeContent"];
  }

  protected get __onDidOpen(): Emitter<TextDocumentChangeEvent<T>> {
    return this["_onDidOpen"];
  }

  protected get __onDidClose(): Emitter<TextDocumentChangeEvent<T>> {
    return this["_onDidClose"];
  }

  protected get __onDidSave(): Emitter<TextDocumentChangeEvent<T>> {
    return this["_onDidSave"];
  }

  protected get __onWillSave(): Emitter<TextDocumentWillSaveEvent<T>> {
    return this["_onWillSave"];
  }

  protected get __willSaveWaitUntil(): RequestHandler<TextDocumentWillSaveEvent<T>, TextEdit[], void> | undefined {
    return this["_willSaveWaitUntil"];
  }

  public override listen(connection: any): Disposable {
    (<any>connection).__textDocumentSync = TextDocumentSyncKind.Incremental;
    const disposables: Disposable[] = [];
    disposables.push(
      connection.onDidOpenTextDocument((event: DidOpenTextDocumentParams) => {
        this.notifyDidOpenTextDocument(event);
      })
    );
    disposables.push(
      connection.onDidChangeTextDocument((event: DidChangeTextDocumentParams) => {
        this.notifyDidChangeTextDocument(event);
      })
    );
    disposables.push(
      connection.onDidCloseTextDocument((event: DidCloseTextDocumentParams) => {
        this.notifyDidCloseTextDocument(event);
      })
    );
    disposables.push(
      connection.onWillSaveTextDocument((event: WillSaveTextDocumentParams) => {
        this.notifyWillSaveTextDocument(event);
      })
    );
    disposables.push(
      connection.onWillSaveTextDocumentWaitUntil((event: WillSaveTextDocumentParams, token: CancellationToken) =>
        this.notifyWillSaveTextDocumentWaitUntil(event, token)
      )
    );
    disposables.push(
      connection.onDidSaveTextDocument((event: DidSaveTextDocumentParams) => {
        this.notifyDidSaveTextDocument(event);
      })
    );
    return Disposable.create(() => {
      disposables.forEach((disposable) => disposable.dispose());
    });
  }

  public resetSyncedDocumentVersion(uri: string, newVersion: number): void {
    let syncedDocument = this.__syncedDocuments.get(uri);
    if (syncedDocument) {
      syncedDocument = this.configuration.update(syncedDocument, [], newVersion);
      this.__syncedDocuments.set(uri, syncedDocument);
    }
  }

  public notifyDidChangeTextDocument(event: DidChangeTextDocumentParams, client?: string): void {
    console.log("notifyDidChangeTextDocument", event, client);
    const td = event.textDocument;
    const changes = event.contentChanges;
    if (changes.length === 0) {
      return;
    }

    const { version } = td;
    if (version == null) {
      throw new Error(`Received document change event for ${td.uri} without valid version identifier`);
    }

    let syncedDocument = this.__syncedDocuments.get(td.uri);
    if (syncedDocument !== undefined) {
      if (syncedDocument.version < version) {
        syncedDocument = this.configuration.update(syncedDocument, changes, version);
        this.__syncedDocuments.set(td.uri, syncedDocument);
      }
      // syncronize back changes to open text document manager
      // after non-LSP client updated text editor content
      if (syncedDocument.version <= version && !client) {
        this.__onDidChangeContent.fire(Object.freeze({ document: syncedDocument }));
      }
    }
  }

  public notifyDidCloseTextDocument(
    event: DidCloseTextDocumentParams,
    deleteFromSyncedDocuments: boolean = false
  ): void {
    const syncedDocument = this.__syncedDocuments.get(event.textDocument.uri);
    if (syncedDocument !== undefined) {
      this.__onDidClose.fire(Object.freeze({ document: syncedDocument }));
    }
    if (deleteFromSyncedDocuments) {
      this.__syncedDocuments.delete(event.textDocument.uri);
    }
  }

  public notifyWillSaveTextDocument(event: WillSaveTextDocumentParams): void {
    const syncedDocument = this.__syncedDocuments.get(event.textDocument.uri);
    if (syncedDocument !== undefined) {
      this.__onWillSave.fire(Object.freeze({ document: syncedDocument, reason: event.reason }));
    }
  }

  public notifyWillSaveTextDocumentWaitUntil(
    event: WillSaveTextDocumentParams,
    token: CancellationToken
  ): HandlerResult<TextEdit[], void> {
    const syncedDocument = this.__syncedDocuments.get(event.textDocument.uri);
    if (syncedDocument !== undefined && this.__willSaveWaitUntil) {
      return this.__willSaveWaitUntil(Object.freeze({ document: syncedDocument, reason: event.reason }), token);
    } else {
      return [];
    }
  }

  public notifyDidSaveTextDocument(event: DidSaveTextDocumentParams): void {
    const syncedDocument = this.__syncedDocuments.get(event.textDocument.uri);
    if (syncedDocument !== undefined) {
      this.__onDidSave.fire(Object.freeze({ document: syncedDocument }));
    }
  }

  public notifyDidOpenTextDocument(event: DidOpenTextDocumentParams, client?: string): void {
    const td = event.textDocument;
    const document = this.configuration.create(td.uri, td.languageId, td.version, td.text);

    // only set syncedDocument if not set yet or newer version available
    let syncedDocument = this.__syncedDocuments.get(td.uri);
    if (!syncedDocument || (syncedDocument && syncedDocument.version < document.version)) {
      this.__syncedDocuments.set(td.uri, document);
    }
    // register that LSP client opened document
    if (!client) {
      const toFire = Object.freeze({ document });
      this.__onDidOpen.fire(toFire);
    }
  }

  update(textDocument: T, text: string, version: number) {
    this.configuration.update(textDocument, [{ text }], version);
  }
}
