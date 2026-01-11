/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { type AstNode, type CstNode, findNodeForProperty, getDocument, isNamed, type NameProvider } from 'langium';
import { properties } from '../../generator-config.js';
import { type UmlDiagramServices } from './uml-diagram-module.js';
import { UNKNOWN_PROJECT_REFERENCE } from './uml-diagram-package-manager.js';

export interface IdAstNode extends AstNode {
    __id: string;
}

export function isIdAstNode(node: AstNode): node is IdAstNode {
    return typeof (node as IdAstNode)[properties.referenceProperty as keyof IdAstNode] === 'string';
}

/**
 * A name provider that returns the fully qualified name of a node by default but also exposes methods to get other names:
 * - The local name is just the name of the node itself if it has a name.
 * - The qualified name / document-local name is the name of the node itself plus all it's named parents within the document
 * - The fully qualified is the package name plus the document-local name.
 */
export class QualifiedNameProvider implements NameProvider {
    constructor(
        protected services: UmlDiagramServices,
        protected packageManager = services.shared.workspace.PackageManager
    ) {}

    /**
     * Returns the direct name of the node if it has one.
     *
     * @param node node
     * @returns direct, local name of the node if available
     */
    getLocalName(node?: AstNode): string | undefined {
        return node
            ? isIdAstNode(node)
                ? (node[properties.referenceProperty as keyof IdAstNode] as string)
                : isNamed(node)
                  ? node.name
                  : undefined
            : undefined;
    }

    /**
     * Returns the qualified name / document-local name, i.e., the local name of the node plus the local name of all it's named
     * parents within the document.
     *
     * @param node node
     * @returns qualified, document-local name
     */
    getQualifiedName(node?: AstNode): string | undefined {
        if (!node) {
            return undefined;
        }
        const name = this.getLocalName(node);
        // let parent = node.$container;
        // while (parent && isIdAstNode(parent)) {
        //   name = concat(parent[properties.referenceProperty], name);
        //   parent = parent.$container;
        // }
        //  while (parent && isNamed(parent)) {
        //    name = concat(parent.name, name);
        //    parent = parent.$container;
        //  }
        return name;
    }

    /**
     * Returns the fully-qualified / package-local name, i.e., the package name plus the document-local name.
     *
     * @param node node
     * @param packageName package name
     * @returns fully qualified, package-local name
     */
    getFullyQualifiedName(
        node: AstNode,
        packageName = this.packageManager.getPackageInfoByDocument(getDocument(node))?.referenceName ?? UNKNOWN_PROJECT_REFERENCE
    ): string | undefined {
        const packageLocalName = this.getQualifiedName(node);
        return packageName + '/' + packageLocalName;
    }

    getName(node?: AstNode): string | undefined {
        return node ? this.getFullyQualifiedName(node) : undefined;
    }

    getNameNode(node: AstNode): CstNode | undefined {
        return findNodeForProperty(node.$cstNode, '__id');
    }
}
