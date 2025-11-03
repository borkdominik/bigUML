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
import {
    DefaultTypes,
    GCompartment,
    GEdge,
    GEdgeBuilder,
    GGraph,
    GGraphBuilder,
    GLabel,
    GModelElement,
    GModelFactory,
    GNode
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { Class, Package, PackageDiagram, Relation, isClass, isPackage, isPackageDiagram } from '../../../language-server/generated/ast.js';
import { ModelTypes } from '../common/util/model-types.js';
import { GPackageClassNode } from './elements/class.graph-extension.js';
import { GPackageNode } from './elements/package.graph-extension.js';
import { PackageDiagramModelIndex } from './package-diagram-model-index.js';
import { PackageDiagramModelState } from './package-diagram-model-state.js';

@injectable()
export class PackageDiagramGModelFactory implements GModelFactory {
    @inject(PackageDiagramModelState)
    protected readonly modelState: PackageDiagramModelState;

    @inject(PackageDiagramModelIndex)
    protected readonly modelIndex: PackageDiagramModelIndex;

    private graphBuilder: GGraphBuilder<GGraph>;

    createModel(): void {
        const newRoot = this.createGraph();
        if (newRoot) {
            // update GLSP root element in state so it can be used in any follow-up actions/commands
            this.modelState.updateRoot(newRoot);
        }
    }

    protected createGraph(): GGraph | undefined {
        const model = this.modelState.semanticRoot;
        this.graphBuilder = GGraph.builder().id(this.modelState.semanticUri);
        if (isPackageDiagram(model.diagram)) {
            this.createEntities(model.diagram);
            this.createEdgesAndMissingNodes(model.diagram).forEach(element => this.graphBuilder.add(element));
        }
        return this.graphBuilder.build();
    }

    createEntities(packageDiagram: PackageDiagram) {
        packageDiagram.entities
            .map(entity => {
                if (isPackage(entity)) {
                    return this.createPackage(entity);
                } else if (isClass(entity)) {
                    return this.createClass(entity);
                }
            })
            .forEach(node => this.graphBuilder.add(node));
    }

    /**
     * @description Creates all the edges of the graphs, handles the cases
     * where no source or target node is specified or where source or target node
     * don't exist, and creates additional nodes to display the missing node
     * on the diagram.
     * @param model The root Model or a Category
     * @returns A list of the created GModelElements
     */
    protected createEdgesAndMissingNodes(model: PackageDiagram): GModelElement[] {
        const createdElements: GModelElement[] = [];
        model.relations
            .filter(relation => relation.target && relation.source)
            .map(relation => this.createRelation(relation))
            .forEach(relation => {
                createdElements.push(relation);
            });

        return createdElements;
    }

    protected createClass(classElement: Class): GNode {
        if (isClass(classElement)) {
            const node = GPackageClassNode.builder()
                .id(classElement.__id)
                .name(classElement.name)
                .isActive(classElement.isActive)
                .isAbstract(classElement.isAbstract)
                .visibility(classElement.visibility);
            const position = this.modelIndex.findPosition(classElement.__id);
            const size = this.modelIndex.findSize(classElement.__id);
            if (size) {
                node.size(size.width, size.height);
                node.addLayoutOptions({ ['prefWidth']: size.width, ['prefHeight']: size.height });
            }
            if (position) {
                node.position(position.x, position.y);
            }
            node.add(node.createCompartmentHeader());

            return node.build();
        }
        return GNode.builder().build();
    }
    protected createPackage(_package: Package): GNode {
        if (isPackage(_package)) {
            const node = GPackageNode.builder().id(_package.__id).name(_package.name).uri(_package.uri).visibility(_package.visibility);
            const position = this.modelIndex.findPosition(_package.__id);
            const size = this.modelIndex.findSize(_package.__id);
            if (size) {
                node.size(size.width, size.height);
                node.addLayoutOptions({ ['prefWidth']: size.width, ['prefHeight']: size.height });
            }
            if (position) {
                node.position(position.x, position.y);
            }
            node.add(node.createCompartmentHeader());
            if (_package.entities?.length > 0) {
                const freeFormCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(_package.__id + '_freeform')
                    .layout('freeform')
                    .addArgs({ 'children-container': true, divider: true })
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true });
                _package.entities?.forEach(entity => {
                    if (isPackage(entity)) {
                        freeFormCompartment.add(this.createPackage(entity));
                    } else if (isClass(entity)) {
                        freeFormCompartment.add(this.createClass(entity));
                    }
                });
                node.add(freeFormCompartment.build());
            }

            return node.build();
        }
        return GNode.builder().build();
    }

    protected createRelation(edge: Relation): GEdge {
        if (!edge.source || !edge.target) {
            throw new Error('Source and target must be set');
        }
        const edgeBuild = new GEdgeBuilder(GEdge)
            .type(this.getElementTypeIdFromRelationType(edge.relationType))
            .sourceId(edge.source.ref!.__id)
            .targetId(edge.target.ref!.__id)
            .id(edge.__id);
        if (edge.relationType === 'ABSTRACTION') {
            edgeBuild.addCssClasses('uml-edge', 'uml-edge-dashed', 'marker-tent-end').addArg('edgePadding', 10);
            edgeBuild.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text('<<abstraction>>').build());
        } else if (edge.relationType === 'DEPENDENCY') {
            edgeBuild.addCssClasses('uml-edge', 'uml-edge-dashed', 'marker-tent-end').addArg('edgePadding', 10);
            edgeBuild.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text('<<dependency>>').build());
        } else if (edge.relationType === 'ELEMENT_IMPORT') {
            edgeBuild.addCssClasses('uml-edge', 'uml-edge-dashed', 'marker-tent-end').addArg('edgePadding', 10);
            edgeBuild.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text('<<element import>>').build());
        } else if (edge.relationType === 'PACKAGE_IMPORT') {
            edgeBuild.addCssClasses('uml-edge', 'uml-edge-dashed', 'marker-tent-end').addArg('edgePadding', 10);
            edgeBuild.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text('<<package import>>').build());
        } else if (edge.relationType === 'PACKAGE_MERGE') {
            edgeBuild.addCssClasses('uml-edge', 'uml-edge-dashed', 'marker-tent-end').addArg('edgePadding', 10);
            edgeBuild.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text('<<package merge>>').build());
        } else if (edge.relationType === 'USAGE') {
            edgeBuild.addCssClasses('uml-edge', 'uml-edge-dashed', 'marker-tent-end').addArg('edgePadding', 10);
            edgeBuild.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text('<<usage>>').build());
        }
        return edgeBuild.build();
    }
    private getElementTypeIdFromRelationType(relationType: string): string {
        switch (relationType) {
            case 'ABSTRACTION':
                return ModelTypes.ABSTRACTION;
            case 'DEPENDENCY':
                return ModelTypes.DEPENDENCY;
            case 'ELEMENT_IMPORT':
                return ModelTypes.ELEMENT_IMPORT;
            case 'PACKAGE_IMPORT':
                return ModelTypes.PACKAGE_IMPORT;
            case 'PACKAGE_MERGE':
                return ModelTypes.PACKAGE_MERGE;
            case 'USAGE':
                return ModelTypes.USAGE;
            default:
                return ModelTypes.ABSTRACTION;
        }
    }
}
