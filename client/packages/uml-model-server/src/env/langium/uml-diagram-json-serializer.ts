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
    type JsonSerializer,
    type JsonSerializeOptions,
    type LangiumDocuments,
    type Mutable,
    type NameProvider,
    type Reference
} from 'langium';
import { type LangiumServices } from 'langium/lsp';
import { URI } from 'vscode-uri';
import { properties } from '../generator-config.js';

interface IntermediateReference {
    $refText?: string;
    $ref?: Language.Reference<AstNode>;
    $error?: string;
}

function isIntermediateReference(obj: unknown): obj is IntermediateReference {
    return typeof obj === 'object' && !!obj && ('$ref' in obj || '$error' in obj);
}

export class UmlDiagramJsonSerializer implements JsonSerializer {
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
        this.linkNode(root, root);
        return root;
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
                return {
                    $refText,
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

    protected linkNode(node: GenericAstNode, root: AstNode, container?: AstNode, containerProperty?: string, containerIndex?: number) {
        for (const [propertyName, item] of Object.entries(node)) {
            if (Array.isArray(item)) {
                for (let index = 0; index < item.length; index++) {
                    const element = item[index];
                    if (isIntermediateReference(element)) {
                        item[index] = this.reviveReference(node, propertyName, root, element);
                    } else if (isAstNode(element)) {
                        this.linkNode(element as GenericAstNode, root, node, propertyName, index);
                    }
                }
            } else if (isIntermediateReference(item)) {
                node[propertyName] = this.reviveReference(node, propertyName, root, item);
            } else if (isAstNode(item)) {
                this.linkNode(item as GenericAstNode, root, node, propertyName);
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
        reference: IntermediateReference
    ): Reference | undefined {
        let refText = reference.$refText;
        if (reference.$ref) {
            const ref = this.getRefNode(root, reference.$ref);
            if (!refText) {
                refText = this.nameProvider.getName(ref);
            }
            return {
                $refText: refText ?? '',
                ref
            } satisfies Mutable<Reference> as Reference;
        } else if (reference.$error) {
            const ref: Mutable<Reference> = {
                $refText: refText ?? '',
                ref: undefined
            };
            ref.error = {
                message: reference.$error ?? '',
                info: { container, property, reference: ref }
            };
            return ref;
        } else {
            return undefined;
        }
    }

    protected getRefNode<T extends AstNode>(root: AstNode, ref: Language.Reference<T>): AstNode {
        if (ref[properties.referenceProperty] as string) {
            if (ref.__documentUri) {
                const doc = this.langiumDocs.getDocument(URI.parse(ref.__documentUri));
                return this.getAstNodeById(doc!.parseResult.value, ref[properties.referenceProperty] as string)!;
            }
            return this.getAstNodeById(root, ref[properties.referenceProperty] as string)!;
        } else if (ref.__path) {
            if (ref.__documentUri) {
                const doc = this.langiumDocs.getDocument(URI.parse(ref.__documentUri));
                return this.astNodeLocator.getAstNode(doc!.parseResult.value, ref.__path)!;
            }
            return this.astNodeLocator.getAstNode(root, ref.__path.substring(1))!;
        }
        return root;
    }

    private getAstNodeById<T extends AstNode = AstNode>(node: AstNode, id: string): T | undefined {
        const retNode = AstUtils.streamAst(node).find((astNode: any) => astNode[properties.referenceProperty] === id);
        if (retNode) return retNode as T;
        return node as T;
    }
}
