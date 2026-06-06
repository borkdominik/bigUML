/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { Cancellation, DefaultLangiumDocuments, type LangiumDocument } from 'langium';
import { type URI } from 'vscode-uri';

type CancellationToken = Cancellation.CancellationToken;
import { type UmlDiagramSharedServices } from './uml-diagram-module.js';
import { isPackageUri } from './uml-diagram-package-manager.js';
import { Utils } from './util/uri-util.js';

export class UmlDiagramLangiumDocuments extends DefaultLangiumDocuments {
    constructor(services: UmlDiagramSharedServices) {
        super(services);
    }

    override async getOrCreateDocument(uri: URI, cancelToken?: CancellationToken): Promise<LangiumDocument> {
        if (isPackageUri(uri)) {
            throw new Error(`Cannot create a Langium document for package file: ${uri.toString()}`);
        }
        return super.getOrCreateDocument(Utils.toRealURI(uri), cancelToken);
    }
}
