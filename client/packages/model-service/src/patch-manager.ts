import * as jsonpatch from "fast-json-patch";
import { v4 as uuidv4 } from "uuid";
import { URI } from "vscode-uri";
import { SharedServices } from "./model-module.js";
import {
  addUUID,
  cleanJSON,
  findUUID,
  rebuildLangiumReferences,
  rebuildReferences,
  removeUUID,
  updateReferences,
} from "./patch-manager.util.js";

interface RedoUndo {
  next?: RedoUndo;
  prev?: RedoUndo;
  redo?: Map<string, string>;
  undo?: Map<string, string>;
}

export class PatchManager {
  redoUndoMap: Map<string, RedoUndo> = new Map<string, RedoUndo>();

  constructor(
    protected shared: SharedServices,
    protected documentManager = shared.workspace.TextDocumentManager,
    protected documents = shared.workspace.LangiumDocuments,
    protected documentBuilder = shared.workspace.DocumentBuilder,
    protected indexManager = shared.workspace.IndexManager
  ) {}

  async applyPatch(_patch: jsonpatch.Operation | Array<jsonpatch.Operation>, _uri: string, client?: string) {
    await this.documentManager.open(_uri, undefined, client);
    let documents = new Set<string>();
    documents = await this.collectAffectedDocuments(documents, _uri);
    const documentMap = new Map();
    const originalDocumentMap = new Map();
    for (let uri of documents) {
      let documentUri = URI.parse(uri).path;
      await this.documentManager.open(documentUri, undefined, client);
      const document = this.documents.getOrCreateDocument(URI.parse(documentUri));
      const jsonSerializer = this.shared.ServiceRegistry.getServices(URI.parse(documentUri)).serializer.JsonSerializer;
      documentMap.set(documentUri, JSON.parse(jsonSerializer.serialize(document.parseResult.value)));
      originalDocumentMap.set(documentUri, document.textDocument.getText());
    }
    _uri = URI.parse(_uri).path;

    const patch = Array.isArray(_patch) ? _patch : [_patch];
    addUUID(documentMap);
    updateReferences(documentMap);
    let result;
    patch.forEach((patchOp) => {
      if ((patchOp.op === "replace" || patchOp.op === "add") && typeof patchOp.value === "object") {
        if (patchOp.op === "replace") {
          patchOp.value["__tmp_uuid__"] = findUUID(JSON.parse(JSON.stringify(documentMap.get(_uri))), patchOp.path);
        } else if (patchOp.op === "add") {
          patchOp.value["__tmp_uuid__"] = uuidv4();
        }
      }
      result = jsonpatch.applyOperation(documentMap.get(_uri), patchOp);
    });
    documentMap.set(_uri, result!.newDocument);
    rebuildReferences(documentMap);
    removeUUID(documentMap);
    cleanJSON(documentMap);
    rebuildLangiumReferences(
      documentMap,
      this.shared.ServiceRegistry.getServices(URI.parse(_uri)).workspace.AstNodeLocator,
      this.shared.ServiceRegistry.getServices(URI.parse(_uri)).references.NameProvider,
      this.documents
    );
    let retVal = await this.updateDocuments(documentMap, _uri, client);
    await this.updateRedoUndo(documentMap, originalDocumentMap, _uri);
    return retVal;
  }

  async updateRedoUndo(documentMap: any, originalDocumentMap: any, _uri: any) {
    let redoUndo;
    if (!this.redoUndoMap.has(URI.parse(_uri).path)) {
      redoUndo = {};
    } else {
      redoUndo = this.redoUndoMap.get(URI.parse(_uri).path);
    }
    if (redoUndo!.next) {
      redoUndo!.next = undefined;
      redoUndo!.redo = undefined;
    }

    const redoMap = new Map();
    const undoMap = new Map();
    documentMap.forEach((value: any, key: any) => {
      redoMap.set(key, value);
      undoMap.set(key, originalDocumentMap.get(key));
    });

    const newRedoUndo: RedoUndo = { prev: redoUndo, undo: undoMap };
    redoUndo!.next = newRedoUndo;
    redoUndo!.redo = redoMap;
    redoUndo = newRedoUndo;
    this.redoUndoMap.set(URI.parse(_uri).path, redoUndo);
  }

  async updateDocuments(documentMap: Map<string, any>, _uri: string, client?: string) {
    let retVal;
    for (let [key, value] of documentMap.entries()) {
      const serializers = this.shared.ServiceRegistry.getServices(URI.parse(key)).serializer;
      const document = this.documents.getOrCreateDocument(URI.parse(key));
      const text = serializers.Serializer.serialize(value);
      const version = this.documentManager.getClientDocumentVersion(key, client ?? "text");

      /** if text editor triggered changes on non-text editors, update non-text editor version to match text-editor version  */
      if (client !== "text" && version < this.documentManager.getClientDocumentVersion(key, "text")) {
        await this.documentManager.update(
          URI.parse(key).toString(),
          this.documentManager.getClientDocumentVersion(key, "text"),
          text,
          client
        );
        /** do not update document manager version, as it has already been updated by text-editor */
      } else {
        this.shared.workspace.TextDocuments.update(document.textDocument, text, version);
        await this.documentManager.update(URI.parse(key).toString(), document.textDocument.version + 1, text, client);
        if (key !== _uri) {
          await this.documentManager.save(URI.parse(key).toString(), text);
        } else {
          await this.documentBuilder.update([URI.parse(key)], []);
          retVal = document.parseResult.value;
        }
      }
      documentMap.set(key, text);
    }
    return retVal;
  }

  async collectAffectedDocuments(docs: Set<string>, uri: string) {
    docs.add(URI.parse(uri).toString());

    for (const doc of this.documents.all) {
      await this.indexManager.updateReferences(doc);
      if (this.indexManager.isAffected(doc, docs)) {
        if (!docs.has(doc.uri.toString())) {
          docs.add(doc.uri.toString());
          docs = new Set([...(await this.collectAffectedDocuments(docs, doc.uri.toString()))]);
        }
      }
    }
    return docs;
  }

  async undo(uri: string, _client?: string) {
    let redoUndo = this.redoUndoMap.get(URI.parse(uri).path);
    if (redoUndo && redoUndo.prev && redoUndo.undo) {
      const undoMap = redoUndo.undo;
      const retVal = await this.redoUndoPatch(undoMap, uri);
      redoUndo = redoUndo.prev;
      this.redoUndoMap.set(URI.parse(uri).path, redoUndo);
      return retVal;
    } else {
      const document = this.documents.getOrCreateDocument(URI.parse(uri));
      return document.parseResult.value;
    }
  }
  async redo(uri: string, _client?: string) {
    let redoUndo = this.redoUndoMap.get(URI.parse(uri).path);
    if (redoUndo && redoUndo.next && redoUndo.redo) {
      const redoMap = redoUndo.redo;
      const retVal = await this.redoUndoPatch(redoMap, uri);
      redoUndo = redoUndo.next;
      this.redoUndoMap.set(URI.parse(uri).path, redoUndo);
      return retVal;
    } else {
      const document = this.documents.getOrCreateDocument(URI.parse(uri));
      return document.parseResult.value;
    }
  }

  async redoUndoPatch(map: Map<string, string>, uri: string, client?: string) {
    let retVal;
    for (let [key, value] of map.entries()) {
      await this.documentManager.open(URI.parse(key).path, undefined, client ?? "glsp");
      const document = this.documents.getOrCreateDocument(URI.parse(key));
      await this.documentManager.update(
        URI.parse(key).path,
        document.textDocument.version + 1,
        value,
        client ?? "glsp"
      );
      await this.documentManager.save(URI.parse(key).path, value);
      if (URI.parse(key).path === URI.parse(uri).path) {
        await this.documentBuilder.update([URI.parse(key)], []);
        retVal = document.parseResult.value;
      }
    }
    return retVal;
  }
}
