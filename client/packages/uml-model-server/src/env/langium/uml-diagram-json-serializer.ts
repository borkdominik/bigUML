/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Language } from '@borkdominik-biguml/uml-language-tooling';
import {
    AstUtils,
    GrammarUtils,
    isAstNode,
    isReference,
    type AstNode,
    type AstNodeLocator,
    type AstNodeRegionWithAssignments,
    type AstNodeWithTextRegion,
    type CstNode,
    type DocumentSegment,
    type GenericAstNode,
    type JsonSerializeOptions,
    type LangiumDocuments,
    type Mutable,
    type NameProvider,
    type Reference
} from 'langium';
import { type LangiumServices } from 'langium/lsp';
import { URI } from 'vscode-uri';
import { properties } from '../generator-config.js';
import type { DocumentResolver, LinkingJsonSerializer } from './extended-services.js';

/** A reference as it is written to JSON: by id or by path, and by document where it crosses one. */
export interface IntermediateReference {
    $refText?: string;
    $ref?: Language.Reference<AstNode>;
    $error?: string;
}

export function isIntermediateReference(obj: unknown): obj is IntermediateReference {
    return typeof obj === 'object' && !!obj && ('$ref' in obj || '$error' in obj);
}

export class UmlDiagramJsonSerializer implements LinkingJsonSerializer {
    protected ignoreProperties = new Set(['$container', '$containerProperty', '$containerIndex', '$document', '$cstNode']);
    protected readonly astNodeLocator: AstNodeLocator;
    protected readonly nameProvider: NameProvider;
    protected readonly langiumDocs: LangiumDocuments;

    constructor(services: LangiumServices) {
        this.astNodeLocator = services.workspace.AstNodeLocator;
        this.nameProvider = services.references.NameProvider;
        this.langiumDocs = services.shared.workspace.LangiumDocuments;
    }

    serialize(node: AstNode, options?: JsonSerializeOptions): string {
        const specificReplacer = options?.replacer;
        const defaultReplacer = (key: string, value: unknown) => this.replacer(key, value, options);
        const replacer = specificReplacer
            ? (key: string, value: unknown) => specificReplacer(key, value, defaultReplacer)
            : defaultReplacer;

        const str = JSON.stringify(node, replacer, options?.space);
        return str;
    }

    deserialize<T extends AstNode = AstNode>(content: string): T {
        const root = JSON.parse(content);
        this.link(root);
        return root;
    }

    link(root: GenericAstNode, resolveDocument?: DocumentResolver): void {
        this.linkNode(root, root, resolveDocument);
    }

    protected replacer(key: string, value: unknown, { refText, sourceText, textRegions }: JsonSerializeOptions = {}): unknown {
        if (this.ignoreProperties.has(key)) {
            return undefined;
        } else if (isReference(value)) {
            const refValue = value.ref;
            const $refText = refText ? value.$refText : undefined;
            if (refValue) {
                if ((refValue as GenericAstNode)[properties.referenceProperty]) {
                    return {
                        $refText,
                        $ref: {
                            __documentUri: value.$nodeDescription?.node ? undefined : value.$nodeDescription?.documentUri.path,
                            __id: (refValue as GenericAstNode)[properties.referenceProperty]
                        }
                    };
                }
                return {
                    $refText,
                    $ref: {
                        __documentUri: value.$nodeDescription?.node ? undefined : value.$nodeDescription?.documentUri.path,
                        __path: refValue && this.astNodeLocator.getAstNodePath(refValue)
                    }
                };
            } else {
                // The text is all that is left of a reference that does not resolve, so it is kept
                // whatever the options say - dropped, the reference would be written back as nothing.
                return {
                    $refText: value.$refText,
                    $error: value.error?.message ?? 'Could not resolve reference'
                };
            }
        } else {
            let astNode: AstNodeWithTextRegion | undefined = undefined;
            if (textRegions && isAstNode(value)) {
                astNode = this.addAstNodeRegionWithAssignmentsTo({ ...value });
                if ((!key || value.$document) && astNode?.$textRegion) {
                    try {
                        astNode.$textRegion.documentURI = AstUtils.getDocument(value).uri.path;
                    } catch (e) {
                        /* do nothing */
                    }
                }
            }
            if (sourceText && !key && isAstNode(value)) {
                astNode ??= { ...value };
                astNode.$sourceText = value.$cstNode?.text;
            }
            return astNode ?? value;
        }
    }

    protected addAstNodeRegionWithAssignmentsTo(node: AstNodeWithTextRegion) {
        const createDocumentSegment: (cstNode: CstNode) => AstNodeRegionWithAssignments = cstNode =>
            <DocumentSegment>{
                offset: cstNode.offset,
                end: cstNode.end,
                length: cstNode.length,
                range: cstNode.range
            };

        if (node.$cstNode) {
            const textRegion = (node.$textRegion = createDocumentSegment(node.$cstNode));
            const assignments: Record<string, DocumentSegment[]> = (textRegion.assignments = {});

            Object.keys(node)
                .filter(key => !key.startsWith('$'))
                .forEach(key => {
                    const propertyAssignments = GrammarUtils.findNodesForProperty(node.$cstNode, key).map(createDocumentSegment);
                    if (propertyAssignments.length !== 0) {
                        assignments[key] = propertyAssignments;
                    }
                });

            return node;
        }
        return undefined;
    }

    /**
     * Turns a parsed JSON tree back into a linked AST: every node knows its container, and every
     * serialised reference is a live `Reference` again. A reference into another document is looked
     * up in that document as it is *now* - or, where `resolveDocument` answers, in the version being
     * written alongside this one.
     */
    protected linkNode(
        node: GenericAstNode,
        root: AstNode,
        resolveDocument: DocumentResolver | undefined,
        container?: AstNode,
        containerProperty?: string,
        containerIndex?: number
    ): void {
        for (const [propertyName, item] of Object.entries(node)) {
            if (Array.isArray(item)) {
                for (let index = 0; index < item.length; index++) {
                    const element = item[index];
                    if (isIntermediateReference(element)) {
                        item[index] = this.reviveReference(node, propertyName, root, element, resolveDocument);
                    } else if (isAstNode(element)) {
                        this.linkNode(element as GenericAstNode, root, resolveDocument, node, propertyName, index);
                    }
                }
            } else if (isIntermediateReference(item)) {
                node[propertyName] = this.reviveReference(node, propertyName, root, item, resolveDocument);
            } else if (isAstNode(item)) {
                this.linkNode(item as GenericAstNode, root, resolveDocument, node, propertyName);
            }
        }
        const mutable = node as Mutable<GenericAstNode>;
        mutable.$container = container;
        mutable.$containerProperty = containerProperty;
        mutable.$containerIndex = containerIndex;
    }

    protected reviveReference(
        container: AstNode,
        property: string,
        root: AstNode,
        reference: IntermediateReference,
        resolveDocument: DocumentResolver | undefined
    ): Reference | undefined {
        const refText = reference.$refText;
        if (reference.$ref) {
            const ref = this.getRefNode(root, reference.$ref, resolveDocument);
            if (ref) {
                return {
                    $refText: refText ?? this.nameProvider.getName(ref) ?? '',
                    ref
                } satisfies Mutable<Reference> as Reference;
            }
            // The target is gone. The reference stays unresolved under the id it named, so that what is
            // written back still says which element it meant rather than nothing at all.
            return this.unresolved(
                container,
                property,
                refText ?? (reference.$ref[properties.referenceProperty] as string | undefined) ?? '',
                'Could not resolve reference'
            );
        }
        if (reference.$error) {
            return this.unresolved(container, property, refText ?? '', reference.$error);
        }
        return undefined;
    }

    protected unresolved(container: AstNode, property: string, refText: string, message: string): Reference {
        const ref: Mutable<Reference> = { $refText: refText, ref: undefined };
        ref.error = { message, info: { container, property, reference: ref } };
        return ref;
    }

    /** The element a serialised reference names, or `undefined` where there is no such element. */
    protected getRefNode<T extends AstNode>(
        root: AstNode,
        ref: Language.Reference<T>,
        resolveDocument: DocumentResolver | undefined
    ): AstNode | undefined {
        const id = ref[properties.referenceProperty] as string | undefined;
        const scope = ref.__documentUri ? this.documentRoot(ref.__documentUri, resolveDocument) : root;
        if (!scope) {
            return undefined;
        }
        if (id) {
            return this.getAstNodeById(scope, id);
        }
        if (ref.__path) {
            return this.astNodeLocator.getAstNode(scope, ref.__documentUri ? ref.__path : ref.__path.substring(1));
        }
        return undefined;
    }

    /** The root of another document a reference points into, or `undefined` where the document is not known. */
    protected documentRoot(documentPath: string, resolveDocument: DocumentResolver | undefined): AstNode | undefined {
        return resolveDocument?.(documentPath) ?? this.langiumDocs.getDocument(URI.parse(documentPath))?.parseResult.value;
    }

    private getAstNodeById<T extends AstNode = AstNode>(node: AstNode, id: string): T | undefined {
        return AstUtils.streamAst(node).find(astNode => (astNode as GenericAstNode)[properties.referenceProperty] === id) as T | undefined;
    }
}
