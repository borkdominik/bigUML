/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { ClassDiagramEdgeTypes, CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import {
    type Class,
    type ClassDiagram,
    type DataType,
    type Enumeration,
    type InstanceSpecification,
    type Interface,
    type Package,
    type PrimitiveType,
    type Relation,
    isAssociation,
    isClass,
    isClassDiagram,
    isGeneralization,
    isPackage
} from '@borkdominik-biguml/uml-model-server/grammar';
import { type GEdge, type GGraph, type GModelElement, type GModelFactory } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { GEdgeElement, GGraphElement, GLabelElement } from '../../../../jsx/index.js';
import { GClassNodeElement } from '../../../elements/class.element.js';
import { GDataTypeNodeElement } from '../../../elements/data-type.element.js';
import { GEnumerationLiteralNodeElement } from '../../../elements/enumeration-literal.element.js';
import { GEnumerationNodeElement } from '../../../elements/enumeration.element.js';
import { GInstanceSpecificationNodeElement } from '../../../elements/instance-specification.element.js';
import { GInterfaceNodeElement } from '../../../elements/interface.element.js';
import { GOperationNodeElement } from '../../../elements/operation.element.js';
import { GPackageNodeElement } from '../../../elements/package.element.js';
import { GPrimitiveTypeNodeElement } from '../../../elements/primitive-type.element.js';
import { GPropertyNodeElement } from '../../../elements/property.element.js';
import { SectionCompartment } from '../../../elements/shared-components.js';
import { GSlotNodeElement } from '../../../elements/slot.element.js';
import { ClassDiagramModelIndex } from './class-diagram-model-index.js';
import { ClassDiagramModelState } from './class-diagram-model-state.js';

@injectable()
export class ClassDiagramGModelFactory implements GModelFactory {
    @inject(ClassDiagramModelState)
    protected readonly modelState: ClassDiagramModelState;

    @inject(ClassDiagramModelIndex)
    protected readonly modelIndex: ClassDiagramModelIndex;

    createModel(): void {
        const newRoot = this.createGraph();
        if (newRoot) {
            this.modelState.updateRoot(newRoot);
        }
    }

    protected createGraph(): GGraph | undefined {
        const model = this.modelState.semanticRoot;
        if (!isClassDiagram(model.diagram)) {
            return undefined;
        }

        const entityNodes = this.createEntities(model.diagram);
        const edgesAndMissing = this.createEdgesAndMissingNodes(model.diagram);

        return (
            <GGraphElement id={this.modelState.semanticUri}>
                {entityNodes}
                {edgesAndMissing}
            </GGraphElement>
        ) as GGraph;
    }

    protected createEntities(classDiagram: ClassDiagram): GModelElement[] {
        return classDiagram.entities
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
            .filter(Boolean) as GModelElement[];
    }

    protected createEdgesAndMissingNodes(model: ClassDiagram): GModelElement[] {
        return model.relations.filter(relation => relation.target && relation.source).map(relation => this.createRelation(relation));
    }

    protected createClass(classElement: Class): GModelElement {
        const position = this.modelIndex.findPosition(classElement.__id);
        const size = this.modelIndex.findSize(classElement.__id);

        const propertiesSection =
            classElement.properties?.length > 0 ? (
                <SectionCompartment id={classElement.__id + '_count_context_1'} dividerText='Attributes'>
                    {classElement.properties.map(p => (
                        <GPropertyNodeElement node={p} />
                    ))}
                </SectionCompartment>
            ) : null;

        const operationsSection =
            classElement.operations?.length > 0 ? (
                <SectionCompartment id={classElement.__id + '_count_context_3'} dividerText='Methods'>
                    {classElement.operations.map(o => (
                        <GOperationNodeElement node={o} />
                    ))}
                </SectionCompartment>
            ) : null;

        return (
            <GClassNodeElement node={classElement} position={position} size={size}>
                {propertiesSection}
                {operationsSection}
            </GClassNodeElement>
        );
    }

    protected createInterface(interfaceElement: Interface): GModelElement {
        const position = this.modelIndex.findPosition(interfaceElement.__id);
        const size = this.modelIndex.findSize(interfaceElement.__id);

        const propertiesSection =
            interfaceElement.properties?.length > 0 ? (
                <SectionCompartment id={interfaceElement.__id + '_count_context_1'} dividerText='Attributes'>
                    {interfaceElement.properties.map(p => (
                        <GPropertyNodeElement node={p} />
                    ))}
                </SectionCompartment>
            ) : null;

        const operationsSection =
            interfaceElement.operations?.length > 0 ? (
                <SectionCompartment id={interfaceElement.__id + '_count_context_3'} dividerText='Methods'>
                    {interfaceElement.operations.map(o => (
                        <GOperationNodeElement node={o} />
                    ))}
                </SectionCompartment>
            ) : null;

        return (
            <GInterfaceNodeElement node={interfaceElement} position={position} size={size}>
                {propertiesSection}
                {operationsSection}
            </GInterfaceNodeElement>
        );
    }

    protected createInstanceSpecification(instanceSpecification: InstanceSpecification): GModelElement {
        const position = this.modelIndex.findPosition(instanceSpecification.__id);
        const size = this.modelIndex.findSize(instanceSpecification.__id);

        const slotsSection =
            instanceSpecification.slots?.length > 0 ? (
                <SectionCompartment id={instanceSpecification.__id + '_count_context_1'} dividerText='Slots'>
                    {instanceSpecification.slots.map(s => (
                        <GSlotNodeElement node={s} />
                    ))}
                </SectionCompartment>
            ) : null;

        return (
            <GInstanceSpecificationNodeElement node={instanceSpecification} position={position} size={size}>
                {slotsSection}
            </GInstanceSpecificationNodeElement>
        );
    }

    protected createEnumeration(enumerationElement: Enumeration): GModelElement {
        const position = this.modelIndex.findPosition(enumerationElement.__id);
        const size = this.modelIndex.findSize(enumerationElement.__id);

        const valuesSection =
            enumerationElement.values?.length > 0 ? (
                <SectionCompartment id={enumerationElement.__id + '_literal_component'}>
                    {enumerationElement.values.map(v => (
                        <GEnumerationLiteralNodeElement node={v} />
                    ))}
                </SectionCompartment>
            ) : null;

        return (
            <GEnumerationNodeElement node={enumerationElement} position={position} size={size}>
                {valuesSection}
            </GEnumerationNodeElement>
        );
    }

    protected createPrimitiveType(primitiveType: PrimitiveType): GModelElement {
        const position = this.modelIndex.findPosition(primitiveType.__id);
        const size = this.modelIndex.findSize(primitiveType.__id);

        return <GPrimitiveTypeNodeElement node={primitiveType} position={position} size={size} />;
    }

    protected createDataType(dataType: DataType): GModelElement {
        const position = this.modelIndex.findPosition(dataType.__id);
        const size = this.modelIndex.findSize(dataType.__id);

        const propertiesSection =
            dataType.properties?.length > 0 ? (
                <SectionCompartment id={dataType.__id + '_count_context_1'} dividerText='Attributes'>
                    {dataType.properties.map(p => (
                        <GPropertyNodeElement node={p} />
                    ))}
                </SectionCompartment>
            ) : null;

        const operationsSection =
            dataType.operations?.length > 0 ? (
                <SectionCompartment id={dataType.__id + '_count_context_3'} dividerText='Methods'>
                    {dataType.operations.map(o => (
                        <GOperationNodeElement node={o} />
                    ))}
                </SectionCompartment>
            ) : null;

        return (
            <GDataTypeNodeElement node={dataType} position={position} size={size}>
                {propertiesSection}
                {operationsSection}
            </GDataTypeNodeElement>
        );
    }

    protected createPackage(_package: Package): GModelElement {
        const position = this.modelIndex.findPosition(_package.__id);
        const size = this.modelIndex.findSize(_package.__id);

        const freeformChildren: GModelElement[] = [];
        if (_package.entities?.length > 0) {
            for (const entity of _package.entities) {
                if (isPackage(entity)) {
                    freeformChildren.push(this.createPackage(entity));
                } else if (isClass(entity)) {
                    freeformChildren.push(this.createClass(entity));
                }
            }
        }

        return (
            <GPackageNodeElement
                node={_package}
                position={position}
                size={size}
                freeformChildren={freeformChildren.length > 0 ? freeformChildren : undefined}
            />
        );
    }

    protected createRelation(edge: Relation): GEdge {
        if (!edge.source || !edge.target) {
            throw new Error('Source and target must be set');
        }

        const cssClasses = ['uml-edge'];
        const args: Record<string, any> = {};
        let labelChild: GModelElement | undefined;

        if (isAssociation(edge)) {
            if (edge.sourceAggregation === 'COMPOSITE') {
                cssClasses.push('marker-diamond-start');
            } else if (edge.sourceAggregation === 'SHARED') {
                cssClasses.push('marker-diamond-empty-start');
            }
            if (edge.targetAggregation === 'COMPOSITE') {
                cssClasses.push('marker-diamond-end');
            } else if (edge.targetAggregation === 'SHARED') {
                cssClasses.push('marker-diamond-empty-end');
            }
        } else if (isGeneralization(edge)) {
            cssClasses.push('marker-triangle-empty-end');
        } else {
            cssClasses.push('uml-edge-dashed', 'marker-tent-end');
            args.edgePadding = 10;
            labelChild = <GLabelElement type={CommonModelTypes.LABEL_TEXT} text='<<abstraction>>' />;
        }

        return (
            <GEdgeElement
                id={edge.__id}
                type={this.getElementTypeIdFromRelationType(edge.relationType)}
                sourceId={edge.source.ref!.__id}
                targetId={edge.target.ref!.__id}
                cssClasses={cssClasses}
                args={Object.keys(args).length > 0 ? args : undefined}
            >
                {labelChild}
            </GEdgeElement>
        ) as GEdge;
    }

    private getElementTypeIdFromRelationType(relationType: string): string {
        switch (relationType) {
            case 'ABSRACTION':
                return ClassDiagramEdgeTypes.ABSTRACTION;
            case 'AGGREGRATION':
                return ClassDiagramEdgeTypes.AGGREGATION;
            case 'ASSOCIATION':
                return ClassDiagramEdgeTypes.ASSOCIATION;
            case 'COMPOSITION':
                return ClassDiagramEdgeTypes.COMPOSITION;
            case 'DEPENDENCY':
                return ClassDiagramEdgeTypes.DEPENDENCY;
            case 'GENERALIZATION':
                return ClassDiagramEdgeTypes.GENERALIZATION;
            case 'INTERFACE_REALIZATION':
                return ClassDiagramEdgeTypes.INTERFACE_REALIZATION;
            case 'PACKAGE_IMPORT':
                return ClassDiagramEdgeTypes.PACKAGE_IMPORT;
            case 'PACKAGE_MERGE':
                return ClassDiagramEdgeTypes.PACKAGE_MERGE;
            case 'REALIZATION':
                return ClassDiagramEdgeTypes.REALIZATION;
            case 'SUBSTITUTION':
                return ClassDiagramEdgeTypes.SUBSTITUTION;
            case 'USAGE':
                return ClassDiagramEdgeTypes.USAGE;
            default:
                return ClassDiagramEdgeTypes.ASSOCIATION;
        }
    }
}
