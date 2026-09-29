/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type IdAstNode, isIdAstNode } from '@borkdominik-biguml/uml-model-server';
import { type Bounds, type Diagram, type Point as PointNode } from '@borkdominik-biguml/uml-model-server/grammar';
import { UmlDiagramLSPServices } from '@borkdominik-biguml/uml-model-server/integration';
import type { Dimension, Point } from '@eclipse-glsp/protocol';
import { GModelIndex } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { type AstNode, AstUtils } from 'langium';

/**
 * Looks elements of the semantic model up by id, and answers where each is stored: as a JSON pointer
 * into the document, which is what a patch is addressed by, and the layout it carries in `bounds`.
 *
 * Indexes the graph as well, as every `GModelIndex` does; the semantic side is rebuilt by
 * `DiagramModelState` whenever the model changes.
 */
@injectable()
export class DiagramModelIndex extends GModelIndex {
    @inject(UmlDiagramLSPServices)
    protected readonly services: UmlDiagramLSPServices;

    protected idToSemanticNode = new Map<string, AstNode>();
    protected idToPath = new Map<string, string>();

    createId(node?: AstNode): string | undefined {
        return this.services.language.references.QualifiedNameProvider.getLocalName(node);
    }

    indexSemanticRoot(root: Diagram): void {
        this.idToSemanticNode.clear();
        this.idToPath.clear();
        AstUtils.streamAst(root).forEach(node => this.indexAstNode(node));
    }

    protected indexAstNode(node: AstNode): void {
        const id = this.createId(node);
        if (id) {
            this.idToSemanticNode.set(id, node);
            this.idToPath.set(id, pathOf(node));
        }
    }

    /** The bounds stored on an element, where it has any. */
    findBounds(elementId: string): Bounds | undefined {
        return (this.findIdElement(elementId) as { bounds?: Bounds } | undefined)?.bounds;
    }

    /** The JSON pointer of an element's `bounds`, whether or not it has any yet. */
    findBoundsPath(elementId: string): string | undefined {
        const path = this.findPath(elementId);
        return path !== undefined ? `${path}/bounds` : undefined;
    }

    findPosition(elementId: string): Point | undefined {
        const bounds = this.findBounds(elementId);
        return bounds ? { x: bounds.x, y: bounds.y } : undefined;
    }

    findSize(elementId: string): Dimension | undefined {
        const bounds = this.findBounds(elementId);
        return bounds ? { width: bounds.width, height: bounds.height } : undefined;
    }

    /** The bend points stored on an edge, where it has any. */
    findRoutingPoints(edgeId: string): PointNode[] | undefined {
        return (this.findIdElement(edgeId) as { routingPoints?: PointNode[] } | undefined)?.routingPoints;
    }

    /** The JSON pointer of the element with this id, as a patch addresses it. */
    findPath(id: string): string | undefined {
        return this.idToPath.get(id);
    }

    /**
     * An id that names no semantic element is an ordinary answer, not a mistake: the graph root, a
     * compartment, a label all have ids of their own and none of them is an element of the model.
     */
    findIdElement(id: string): IdAstNode | undefined {
        const semanticNode = this.idToSemanticNode.get(id);
        return isIdAstNode(semanticNode) ? semanticNode : undefined;
    }

    findSemanticElement<T extends AstNode>(id: string, guard: (item: unknown) => item is T): T | undefined {
        const semanticNode = this.idToSemanticNode.get(id);
        return guard(semanticNode) ? semanticNode : undefined;
    }
}

/**
 * The JSON pointer of a node in its document: the containment properties and array indices down from
 * the root, which is how the serializer lays the document out.
 */
function pathOf(node: AstNode): string {
    const segments: string[] = [];
    for (let current: AstNode | undefined = node; current?.$container; current = current.$container) {
        if (current.$containerIndex !== undefined) {
            segments.unshift(String(current.$containerIndex));
        }
        segments.unshift(current.$containerProperty!);
    }
    return segments.length > 0 ? `/${segments.join('/')}` : '';
}
