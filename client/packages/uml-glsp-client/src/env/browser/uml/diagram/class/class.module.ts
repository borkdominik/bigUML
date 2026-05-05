/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ClassDiagramEdgeTypes, ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server/gen/common';
import { configureModelElement, FeatureModule } from '@eclipse-glsp/client';
import {
    GAbstractionEdge,
    GAbstractionEdgeView,
    GAggregationEdge,
    GAggregationEdgeView,
    GAssociationEdge,
    GAssociationEdgeView,
    GClassNode,
    GClassNodeView,
    GCompositionEdge,
    GCompositionEdgeView,
    GDataTypeNode,
    GDataTypeNodeView,
    GDependencyEdge,
    GDependencyEdgeView,
    GEnumerationLiteralNode,
    GEnumerationLiteralNodeView,
    GEnumerationNode,
    GEnumerationNodeView,
    GGeneralizationEdge,
    GGeneralizationEdgeView,
    GInstanceSpecificationNode,
    GInstanceSpecificationNodeView,
    GInterfaceNode,
    GInterfaceNodeView,
    GInterfaceRealizationEdge,
    GInterfaceRealizationEdgeView,
    GOperationNode,
    GOperationNodeView,
    GPackageImportEdge,
    GPackageImportEdgeView,
    GPackageMergeEdge,
    GPackageMergeEdgeView,
    GPackageNode,
    GPackageNodeView,
    GParameterNode,
    GParameterNodeView,
    GPrimitiveTypeNode,
    GPrimitiveTypeNodeView,
    GPropertyNode,
    GPropertyNodeView,
    GRealizationEdge,
    GRealizationEdgeView,
    GSlotNode,
    GSlotNodeView,
    GSubstitutionEdge,
    GSubstitutionEdgeView,
    GUsageEdge,
    GUsageEdgeView
} from '../../elements/index.js';

export const umlClassDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, ClassDiagramNodeTypes.CLASS, GClassNode, GClassNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.ABSTRACT_CLASS, GClassNode, GClassNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.DATA_TYPE, GDataTypeNode, GDataTypeNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.ENUMERATION, GEnumerationNode, GEnumerationNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.ENUMERATION_LITERAL, GEnumerationLiteralNode, GEnumerationLiteralNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.INTERFACE, GInterfaceNode, GInterfaceNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.OPERATION, GOperationNode, GOperationNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.PACKAGE, GPackageNode, GPackageNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.PARAMETER, GParameterNode, GParameterNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.PROPERTY, GPropertyNode, GPropertyNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.PRIMITIVE_TYPE, GPrimitiveTypeNode, GPrimitiveTypeNodeView);
    configureModelElement(context, ClassDiagramNodeTypes.SLOT, GSlotNode, GSlotNodeView);
    configureModelElement(
        context,
        ClassDiagramNodeTypes.INSTANCE_SPECIFICATION,
        GInstanceSpecificationNode,
        GInstanceSpecificationNodeView
    );

    // Edges
    configureModelElement(context, ClassDiagramEdgeTypes.ABSTRACTION, GAbstractionEdge, GAbstractionEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.ASSOCIATION, GAssociationEdge, GAssociationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.AGGREGATION, GAggregationEdge, GAggregationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.COMPOSITION, GCompositionEdge, GCompositionEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.DEPENDENCY, GDependencyEdge, GDependencyEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.INTERFACE_REALIZATION, GInterfaceRealizationEdge, GInterfaceRealizationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.GENERALIZATION, GGeneralizationEdge, GGeneralizationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.REALIZATION, GRealizationEdge, GRealizationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.SUBSTITUTION, GSubstitutionEdge, GSubstitutionEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.USAGE, GUsageEdge, GUsageEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.PACKAGE_IMPORT, GPackageImportEdge, GPackageImportEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.PACKAGE_MERGE, GPackageMergeEdge, GPackageMergeEdgeView);
});
