/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { DefaultDocumentBuilder } from "langium";
import { CancellationToken } from "vscode-languageclient";
import { URI, Utils as UriUtils } from "vscode-uri";
import { Utils } from "./util/uri-util.js";

/**
 * A document builder that can also handle directories by flattening out directories to an array of file URIs.
 */
export class <%= LanguageName %>DocumentBuilder extends DefaultDocumentBuilder {
  override update(
    changed: URI[],
    deleted: URI[],
    cancelToken?: CancellationToken | undefined
  ): Promise<void> {
    return super.update(
      changed.flatMap((uri) => this.flattenAndAdaptURI(uri)),
      deleted.flatMap((uri) => this.collectDeletedURIs(uri)),
      cancelToken
    );
  }

  protected flattenAndAdaptURI(uri: URI): URI[] {
    try {
      return Utils.flatten(Utils.toRealURI(uri));
    } catch (error) {
      return [uri];
    }
  }

  protected collectDeletedURIs(uri: URI): URI[] {
    const ext = UriUtils.extname(uri);
    if (ext) {
      return [uri];
    }
    // potential directory delete
    const dirPath = uri.path + "/";
    const deletedDocuments = this.langiumDocuments.all
      .filter((doc) => doc.uri.path.startsWith(dirPath))
      .map((doc) => doc.uri)
      .toArray();
    return deletedDocuments || [uri];
  }
}
