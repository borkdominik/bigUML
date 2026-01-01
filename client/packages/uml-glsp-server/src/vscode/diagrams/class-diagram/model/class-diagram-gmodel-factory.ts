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
    type Class,
    type ClassDiagram,
    type DataType,
    type Enumeration,
    type EnumerationLiteral,
    type InstanceSpecification,
    type Interface,
    type Operation,
    type Package,
    type PrimitiveType,
    type Property,
    type Relation,
    type Slot,
    isAssociation,
    isClass,
    isClassDiagram,
    isDataType,
    isEnumeration,
    isEnumerationLiteral,
    isGeneralization,
    isInstanceSpecification,
    isInterface,
    isOperation,
    isPackage,
    isPrimitiveType,
    isProperty,
    isSlot
} from '@borkdominik-biguml/model-server/grammar';
import {
    DefaultTypes,
    GCompartment,
    GEdge,
    GEdgeBuilder,
    GGraph,
    type GGraphBuilder,
    GLabel,
    type GModelElement,
    type GModelFactory,
    GNode
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ModelTypes } from '../common/util/model-types.js';
import { ClassDiagramModelIndex } from './class-diagram-model-index.js';
import { ClassDiagramModelState } from './class-diagram-model-state.js';
import { GClassNode } from './elements/class.graph-extension.js';
import { GDataTypeNode } from './elements/data-type.graph-extension.js';
import { GEnumerationLiteralNode } from './elements/enumeration-literal.graph-extension.js';
import { GEnumerationNode } from './elements/enumeration.graph-extension.js';
import { GInstanceSpecificationNode } from './elements/instance-specification.graph-extension.js';
import { GInterfaceNode } from './elements/interface.graph-extension.js';
import { GOperationNode } from './elements/operation.graph-extension.js';
import { GPackageNode } from './elements/package.graph-extension.js';
import { GPropertyNode } from './elements/property.graph-extension.js';
import { GSlotNode } from './elements/slot.graph-extension.js';

@injectable()
export class ClassDiagramGModelFactory implements GModelFactory {
    @inject(ClassDiagramModelState)
    protected readonly modelState: ClassDiagramModelState;

    @inject(ClassDiagramModelIndex)
    protected readonly modelIndex: ClassDiagramModelIndex;

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
        if (isClassDiagram(model.diagram)) {
            this.createEntities(model.diagram);
            this.createEdgesAndMissingNodes(model.diagram).forEach(element => this.graphBuilder.add(element));
        }
        return this.graphBuilder.build();
    }

    createEntities(classDiagram: ClassDiagram) {
        classDiagram.entities
            .map(entity => {
                switch (entity.$type) {
                    case 'Class':
                        return this.createClass(entity);
                    case 'Interface':
                        return this.createInterface(entity);
                    case 'InstanceSpecification':
                        return this.createInstanceSpecification(entity);
                    case 'Enumeration':
                        return this.createEnumeration(entity);
                    case 'DataType':
                        return this.createDataType(entity);
                    case 'PrimitiveType':
                        return this.createPrimitiveType(entity);
                    case 'Package':
                        return this.createPackage(entity);
                }

                return undefined;
            })
            .forEach(node => this.graphBuilder.add(node!));
    }

    /**
     * @description Creates all the edges of the graphs, handles the cases
     * where no source or target node is specified or where source or target node
     * don't exist, and creates additional nodes to display the missing node
     * on the diagram.
     * @param model The root Model or a Category
     * @returns A list of the created GModelElements
     */
    protected createEdgesAndMissingNodes(model: ClassDiagram): GModelElement[] {
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
            const node = GClassNode.builder().id(classElement.__id).name(classElement.name).isAbstract(classElement.isAbstract);
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
            if (classElement.properties?.length > 0) {
                const divider = GNode.builder()
                    .type(ModelTypes.DIVIDER)
                    .addLayoutOption('hGrab', true)
                    .layout('hbox')
                    .add(GLabel.builder().text('Attributes').addCssClass('uml-divider-subtitle').build())
                    .build();
                const propertyCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(classElement.__id + '_count_context_' + 1)
                    .layout('vbox')
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true, ['hGrab']: true });
                propertyCompartment.add(divider);
                classElement.properties.forEach(property => propertyCompartment.add(this.createProperty(property)));
                node.add(propertyCompartment.build());
            }
            if (classElement.operations?.length > 0) {
                const divider = GNode.builder()
                    .type(ModelTypes.DIVIDER)
                    .addLayoutOption('hGrab', true)
                    .layout('hbox')
                    .add(GLabel.builder().text('Methods').addCssClass('uml-divider-subtitle').build())
                    .build();
                const operationsCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(classElement.__id + '_count_context_' + 3)
                    .layout('vbox')
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true, ['hGrab']: true });
                operationsCompartment.add(divider);
                classElement.operations.forEach(operation => operationsCompartment.add(this.createOperation(operation)));
                node.add(operationsCompartment.build());
            }
            return node.build();
        }
        return GNode.builder().build();
    }

    protected createInstanceSpecification(instanceSpecification: InstanceSpecification): GNode {
        if (isInstanceSpecification(instanceSpecification)) {
            const node = GInstanceSpecificationNode.builder().id(instanceSpecification.__id).name(instanceSpecification.name);
            const position = this.modelIndex.findPosition(instanceSpecification.__id);
            const size = this.modelIndex.findSize(instanceSpecification.__id);
            if (size) {
                node.size(size.width, size.height);
                node.addLayoutOptions({ ['prefWidth']: size.width, ['prefHeight']: size.height });
            }
            if (position) {
                node.position(position.x, position.y);
            }
            node.add(node.createCompartmentHeader());
            if (instanceSpecification.slots?.length > 0) {
                const divider = GNode.builder()
                    .type(ModelTypes.DIVIDER)
                    .addLayoutOption('hGrab', true)
                    .layout('hbox')
                    .add(GLabel.builder().text('Slots').addCssClass('uml-divider-subtitle').build())
                    .build();
                const slotCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(instanceSpecification.__id + '_count_context_' + 1)
                    .layout('vbox')
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true, ['hGrab']: true });
                slotCompartment.add(divider);
                instanceSpecification.slots.forEach(slot => slotCompartment.add(this.createSlot(slot)));
                node.add(slotCompartment.build());
            }
            return node.build();
        }
        return GNode.builder().build();
    }

    protected createInterface(interfaceElement: Interface): GNode {
        if (isInterface(interfaceElement)) {
            const node = GInterfaceNode.builder().id(interfaceElement.__id).name(interfaceElement.name);
            const position = this.modelIndex.findPosition(interfaceElement.__id);
            const size = this.modelIndex.findSize(interfaceElement.__id);
            if (size) {
                node.size(size.width, size.height);
                node.addLayoutOptions({ ['prefWidth']: size.width, ['prefHeight']: size.height });
            }
            if (position) {
                node.position(position.x, position.y);
            }
            node.add(node.createCompartmentHeader());
            if (interfaceElement.properties?.length > 0) {
                const divider = GNode.builder()
                    .type(ModelTypes.DIVIDER)
                    .addLayoutOption('hGrab', true)
                    .layout('hbox')
                    .add(GLabel.builder().text('Attributes').addCssClass('uml-divider-subtitle').build())
                    .build();
                const propertyCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(interfaceElement.__id + '_count_context_' + 1)
                    .layout('vbox')
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true, ['hGrab']: true });
                propertyCompartment.add(divider);
                interfaceElement.properties.forEach(property => propertyCompartment.add(this.createProperty(property)));
                node.add(propertyCompartment.build());
            }
            if (interfaceElement.operations?.length > 0) {
                const divider = GNode.builder()
                    .type(ModelTypes.DIVIDER)
                    .addLayoutOption('hGrab', true)
                    .layout('hbox')
                    .add(GLabel.builder().text('Methods').addCssClass('uml-divider-subtitle').build())
                    .build();
                const operationsCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(interfaceElement.__id + '_count_context_' + 3)
                    .layout('vbox')
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true, ['hGrab']: true });
                operationsCompartment.add(divider);
                interfaceElement.operations.forEach(operation => operationsCompartment.add(this.createOperation(operation)));
                node.add(operationsCompartment.build());
            }
            return node.build();
        }
        return GNode.builder().build();
    }
    protected createEnumeration(enumerationElement: Enumeration): GNode {
        if (isEnumeration(enumerationElement)) {
            const node = GEnumerationNode.builder().id(enumerationElement.__id).name(enumerationElement.name);
            const position = this.modelIndex.findPosition(enumerationElement.__id);
            const size = this.modelIndex.findSize(enumerationElement.__id);
            if (size) {
                node.size(size.width, size.height);
                node.addLayoutOptions({ ['prefWidth']: size.width, ['prefHeight']: size.height });
            }
            if (position) {
                node.position(position.x, position.y);
            }
            node.add(node.createCompartmentHeader());
            if (enumerationElement.values?.length > 0) {
                const valueCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(enumerationElement.__id + '_literal_component')
                    .layout('vbox')
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true, ['hGrab']: true });
                enumerationElement.values.forEach(enumLiteral => valueCompartment.add(this.createEnumLiteral(enumLiteral)));
                node.add(valueCompartment.build());
            }
            return node.build();
        }
        return GNode.builder().build();
    }

    protected createPrimitiveType(primitiveType: PrimitiveType): GNode {
        if (isPrimitiveType(primitiveType)) {
            const node = GEnumerationNode.builder().id(primitiveType.__id).name(primitiveType.name);
            const position = this.modelIndex.findPosition(primitiveType.__id);
            const size = this.modelIndex.findSize(primitiveType.__id);
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

    protected createDataType(dataType: DataType): GNode {
        if (isDataType(dataType)) {
            const node = GDataTypeNode.builder().id(dataType.__id).name(dataType.name);
            const position = this.modelIndex.findPosition(dataType.__id);
            const size = this.modelIndex.findSize(dataType.__id);
            if (size) {
                node.size(size.width, size.height);
                node.addLayoutOptions({ ['prefWidth']: size.width, ['prefHeight']: size.height });
            }
            if (position) {
                node.position(position.x, position.y);
            }
            node.add(node.createCompartmentHeader());
            if (dataType.properties?.length > 0) {
                const divider = GNode.builder()
                    .type(ModelTypes.DIVIDER)
                    .addLayoutOption('hGrab', true)
                    .layout('hbox')
                    .add(GLabel.builder().text('Attributes').addCssClass('uml-divider-subtitle').build())
                    .build();
                const propertyCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(dataType.__id + '_count_context_' + 1)
                    .layout('vbox')
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true, ['hGrab']: true });
                propertyCompartment.add(divider);
                dataType.properties.forEach(property => propertyCompartment.add(this.createProperty(property)));
                node.add(propertyCompartment.build());
            }
            if (dataType.operations?.length > 0) {
                const divider = GNode.builder()
                    .type(ModelTypes.DIVIDER)
                    .addLayoutOption('hGrab', true)
                    .layout('hbox')
                    .add(GLabel.builder().text('Methods').addCssClass('uml-divider-subtitle').build())
                    .build();
                const operationsCompartment = GCompartment.builder()
                    .type(DefaultTypes.COMPARTMENT)
                    .id(dataType.__id + '_count_context_' + 3)
                    .layout('vbox')
                    .addLayoutOptions({ ['hAlign']: 'left', ['resizeContainer']: true, ['hGrab']: true });
                operationsCompartment.add(divider);
                dataType.operations.forEach(operation => operationsCompartment.add(this.createOperation(operation)));
                node.add(operationsCompartment.build());
            }
            return node.build();
        }
        return GNode.builder().build();
    }

    protected createProperty(property: Property): GCompartment {
        if (isProperty(property)) {
            const prop = GPropertyNode.builder()
                .id(property.__id)
                .layout('hbox')
                .addLayoutOptions({ ['resizeContainer']: true })
                .name(property.name!)
                .propertyType(property.propertyType!.ref!.name)
                .multiplicity(property.multiplicity!)
                .addArg('build_by', 'dave')
                .visibility(property.visibility!);
            prop.add(prop.leftSide());
            prop.add(prop.rightSide());
            return prop.build();
        }
        return GCompartment.builder().build();
    }

    protected createSlot(slot: Slot): GCompartment {
        if (isSlot(slot)) {
            const prop = GSlotNode.builder()
                .id(slot.__id)
                .addLayoutOptions({ ['resizeContainer']: true, ['hGap']: 3 })
                .add(
                    GLabel.builder()
                        .type(ModelTypes.LABEL_TEXT)
                        .text(slot.definingFeature?.ref?.name ?? '')
                        .build()
                )
                .add(
                    GLabel.builder()
                        .type(ModelTypes.LABEL_TEXT)
                        .text(`[${slot.values?.map(value => value.value).join(',')}]`)
                        .build()
                );
            return prop.build();
        }
        return GCompartment.builder().build();
    }

    protected createPackage(_package: Package): GNode {
        if (isPackage(_package)) {
            const node = GPackageNode.builder().id(_package.__id).name(_package.name).uri(_package.uri!).visibility(_package.visibility!);
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

    protected createEnumLiteral(enumLiteral: EnumerationLiteral): GCompartment {
        if (isEnumerationLiteral(enumLiteral)) {
            const enumLit = GEnumerationLiteralNode.builder()
                .id(enumLiteral.__id)
                .layout('hbox')
                .addArg('build_by', 'dave')
                .addLayoutOptions({ ['resizeContainer']: true })
                .name(enumLiteral.name);

            enumLit.add(enumLit.nameBuilder().build());
            return enumLit.build();
        }
        return GCompartment.builder().build();
    }

    protected createOperation(operation: Operation): GCompartment {
        if (isOperation(operation)) {
            const prop = GOperationNode.builder()
                .id(operation.__id)
                .layout('hbox')
                .addLayoutOptions({ ['resizeContainer']: true })
                .name(operation.name)
                .addArg('build_by', 'dave')
                .visibility(operation.visibility!)
                .parameterList(operation.parameters.map(param => ({ key: param.name!, type: param.parameterType!.ref!.name })));
            prop.add(prop.leftSide());
            prop.add(prop.rightSide());
            return prop.build();
        }
        return GCompartment.builder().build();
    }

    protected createRelation(edge: Relation): GEdge {
        if (!edge.source || !edge.target) {
            throw new Error('Source and target must be set');
        }
        const edgeBuild = new GEdgeBuilder(GEdge)
            .type(this.getElementTypeIdFromRelationType(edge.relationType))
            .sourceId(edge.source.ref!.__id)
            .targetId(edge.target.ref!.__id)
            .id(edge.__id)
            .addCssClass('uml-edge');
        if (isAssociation(edge)) {
            if (edge.sourceAggregation === 'COMPOSITE') {
                edgeBuild.addCssClass('marker-diamond-start');
            } else if (edge.sourceAggregation === 'SHARED') {
                edgeBuild.addCssClass('marker-diamond-empty-start');
            }
            if (edge.targetAggregation === 'COMPOSITE') {
                edgeBuild.addCssClass('marker-diamond-end');
            } else if (edge.targetAggregation === 'SHARED') {
                edgeBuild.addCssClass('marker-diamond-empty-end');
            }
        } else if (isGeneralization(edge)) {
            edgeBuild.addCssClass('marker-triangle-empty-end');
        } else {
            edgeBuild.addCssClasses('uml-edge', 'uml-edge-dashed', 'marker-tent-end').addArg('edgePadding', 10);
            edgeBuild.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text('<<abstraction>>').build());
        }
        return edgeBuild.build();
    }
    private getElementTypeIdFromRelationType(relationType: string): string {
        switch (relationType) {
            case 'ABSRACTION':
                return ModelTypes.ABSTRACTION;
            case 'AGGREGRATION':
                return ModelTypes.AGGREGATION;
            case 'ASSOCIATION':
                return ModelTypes.ASSOCIATION;
            case 'COMPOSITION':
                return ModelTypes.COMPOSITION;
            case 'DEPENDENCY':
                return ModelTypes.DEPENDENCY;
            case 'GENERALIZATION':
                return ModelTypes.GENERALIZATION;
            case 'INTERFACE_REALIZATION':
                return ModelTypes.INTERFACE_REALIZATION;
            case 'PACKAGE_IMPORT':
                return ModelTypes.PACKAGE_IMPORT;
            case 'PACKAGE_MERGE':
                return ModelTypes.PACKAGE_MERGE;
            case 'REALIZATION':
                return ModelTypes.REALIZATION;
            case 'SUBSTITUTION':
                return ModelTypes.SUBSTITUTION;
            case 'USAGE':
                return ModelTypes.USAGE;
            default:
                return ModelTypes.ASSOCIATION;
        }
    }
}
