/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { DefaultLangiumDocuments } from 'langium';
import { type URI } from 'vscode-uri';
import { isPackageUri } from './uml-diagram-package-manager.js';
import { Utils } from './util/uri-util.js';

export class UmlDiagramLangiumDocuments extends DefaultLangiumDocuments {
    override getOrCreateDocument(uri: URI): any {
        // only create documents for actual language files but not for package.json
        return isPackageUri(uri) ? undefined : super.getOrCreateDocument(Utils.toRealURI(uri));
    }
}
