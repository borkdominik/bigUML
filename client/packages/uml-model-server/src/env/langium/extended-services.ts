/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type AstNode, DefaultServiceRegistry, type GenericAstNode, type Hydrator, type JsonSerializer } from 'langium';
import { type LangiumServices } from 'langium/lsp';
import { type URI } from 'vscode-uri';
import { type Serializer } from './serializer.js';

/**
 * How the language's services extend Langium's: a serializer slot, holding the JSON form the model is
 * patched in and the text form it is stored in.
 */

/** Answers the root of a document being rewritten alongside the one being linked, by its path. */
export type DocumentResolver = (documentPath: string) => AstNode | undefined;

/** A JSON serializer that can also turn a parsed JSON tree back into a linked AST in place. */
export interface LinkingJsonSerializer extends JsonSerializer {
    link(root: GenericAstNode, resolveDocument?: DocumentResolver): void;
}

export interface ExtendedLangiumServices extends LangiumServices {
    serializer: {
        Hydrator: Hydrator;
        JsonSerializer: LinkingJsonSerializer;
        Serializer: Serializer<AstNode>;
    };
}

export class ExtendedServiceRegistry extends DefaultServiceRegistry {
    override getServices(uri: URI): ExtendedLangiumServices {
        return super.getServices(uri) as ExtendedLangiumServices;
    }
}
