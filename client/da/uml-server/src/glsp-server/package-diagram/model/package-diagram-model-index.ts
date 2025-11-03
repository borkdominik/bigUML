/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { GModelIndex } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';

import { AstNode, streamAst } from 'langium';
import { BigUmlLSPServices } from '../../../integration.js';
import {
    Class,
    Diagram,
    Enumeration,
    Position,
    Relation,
    Size,
    isClass,
    isEnumeration,
    isPosition,
    isRelation,
    isSize
} from '../../../language-server/generated/ast.js';
import { IdAstNode, isIdAstNode } from '../../../language-server/yo-generated/uml-naming.js';

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject {
    [key: string]: JSONValue;
}
type JSONArray = JSONValue[];

/**
 * Custom model index that not only indexes the GModel elements but also the semantic elements (AstNodes) they represent.
 */
@injectable()
export class PackageDiagramModelIndex extends GModelIndex {
    @inject(BigUmlLSPServices) services: BigUmlLSPServices;

    protected idToSemanticNode = new Map<string, AstNode>();
    protected idToPath = new Map<string, string>();

    createId(node?: AstNode): string | undefined {
        return this.services.language.references.QualifiedNameProvider.getLocalName(node);
    }

    indexSemanticRoot(root: Diagram): void {
        this.idToSemanticNode.clear();
        this.idToPath.clear();
        streamAst(root).forEach(node => {
            this.indexAstNode(node);
        });
        this.collectIdToPath(JSON.parse(this.services.language.serializer.JsonSerializer.serialize(root)));
    }

    collectIdToPath(json: JSONValue, path: string = ''): void {
        if (json && typeof json === 'object') {
            if (Array.isArray(json)) {
                json.forEach((element, index) => {
                    this.collectIdToPath(element, path + '/' + index);
                });
            } else {
                Object.keys(json).forEach(key => {
                    if (key === '__id') {
                        this.idToPath.set(json[key] as string, path);
                    }
                    if (key !== '$ref') {
                        this.collectIdToPath(json[key], path + '/' + key);
                    }
                });
            }
        }
    }

    protected indexAstNode(node: AstNode): void {
        const id = this.createId(node);
        if (id) {
            this.idToSemanticNode.set(id, node);
        }
    }

    addNodeToIndexWithDifferentId(idNode: AstNode, node: AstNode): void {
        const id = this.createId(idNode);
        if (id) {
            this.idToSemanticNode.set(id, node);
        }
    }

    findClass(id: string): Class | undefined {
        return this.findSemanticElement(id, isClass);
    }
    findEnumeration(id: string): Enumeration | undefined {
        return this.findSemanticElement(id, isEnumeration);
    }
    findEdge(id: string): Relation | undefined {
        return this.findSemanticElement(id, isRelation);
    }
    findSize(nodeId: string): Size | undefined {
        return this.findSemanticElement(`size_${nodeId}`, isSize);
    }
    findSizePath(nodeId: string): string | undefined {
        return this.findPath(`size_${nodeId}`);
    }
    findPosition(nodeId: string): Position | undefined {
        return this.findSemanticElement(`pos_${nodeId}`, isPosition);
    }
    findPositionPath(nodeId: string): string | undefined {
        return this.findPath(`pos_${nodeId}`);
    }
    findPath(id: string): string | undefined {
        return this.idToPath.get(id);
    }
    findIdElement(id: string): IdAstNode | undefined {
        const semanticNode = this.idToSemanticNode.get(id);
        return isIdAstNode(semanticNode) ? semanticNode : undefined;
    }
    findSemanticElement<T extends AstNode>(id: string, guard: (item: unknown) => item is T): T | undefined {
        const semanticNode = this.idToSemanticNode.get(id);
        return guard(semanticNode) ? semanticNode : undefined;
    }
}
