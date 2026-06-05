/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    AstUtils,
    Cancellation,
    DefaultLangiumDocumentFactory,
    type AstNode,
    type LangiumDocument,
    type ParserOptions
} from 'langium';
import { type TextDocument } from 'vscode-languageserver-textdocument';
import { type URI } from 'vscode-uri';
import { type UmlDiagramSharedServices } from './uml-diagram-module.js';

type CancellationToken = Cancellation.CancellationToken;

export class UmlDiagramLangiumDocumentFactory extends DefaultLangiumDocumentFactory {
    constructor(services: UmlDiagramSharedServices) {
        super(services);
    }

    override fromTextDocument<T extends AstNode = AstNode>(
        textDocument: TextDocument,
        uri?: URI,
        options?: ParserOptions
    ): LangiumDocument<T>;
    override fromTextDocument<T extends AstNode = AstNode>(
        textDocument: TextDocument,
        uri: URI | undefined,
        cancellationToken: CancellationToken
    ): Promise<LangiumDocument<T>>;
    override fromTextDocument<T extends AstNode = AstNode>(
        textDocument: TextDocument,
        uri?: URI,
        options?: any
    ): LangiumDocument<T> | Promise<LangiumDocument<T>> {
        const returnValue = super.fromTextDocument<T>(textDocument, uri, options);
        if (returnValue instanceof Promise) {
            return returnValue;
        }
        const rootElement = returnValue.parseResult.value;

        AstUtils.streamAllContents(rootElement).forEach((astNode: any) => {
            if (astNode.id === undefined) {
                astNode.id = this.generateUniqueId();
            }
        });
        return returnValue;
    }

    generateUniqueId(): string {
        const dateStr = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `${dateStr}-${randomStr}`;
    }
}
