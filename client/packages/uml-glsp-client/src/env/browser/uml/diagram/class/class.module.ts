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
    GAssociationEdge,
    GAssociationEdgeView,
    GClassNode,
    GClassNodeView,
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
    GNaryAssociationNode,
    GNaryAssociationNodeView,
    GGenericEdge,
    GGenericEdgeView,
    GNoteNode,
    GNoteNodeView,
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
    GTextLabelNode,
    GTextLabelNodeView,
    GUsageEdge,
    GUsageEdgeView,
    GElementImportEdge,
    GElementImportEdgeView,
    NamedElement,
    NamedElementView
} from '../../elements/index.js';

export const umlClassDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, ClassDiagramNodeTypes.CLASS, GClassNode, GClassNodeView);
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
    // The diamond an association between more than two classes is drawn through.
    configureModelElement(context, ClassDiagramNodeTypes.NARY_ASSOCIATION, GNaryAssociationNode, GNaryAssociationNodeView);
    // A value of an instance's slot drawn as a node of its own - `name = value`.
    configureModelElement(context, ClassDiagramNodeTypes.LITERAL_SPECIFICATION, NamedElement, NamedElementView);
    configureModelElement(
        context,
        ClassDiagramNodeTypes.INSTANCE_SPECIFICATION,
        GInstanceSpecificationNode,
        GInstanceSpecificationNodeView
    );

    // The note and the free label, which every diagram has: both say something about the diagram
    // rather than being part of any one notation.
    configureModelElement(context, ClassDiagramNodeTypes.NOTE, GNoteNode, GNoteNodeView);
    configureModelElement(context, ClassDiagramEdgeTypes.GENERIC_EDGE, GGenericEdge, GGenericEdgeView);
    configureModelElement(context, ClassDiagramNodeTypes.TEXT_LABEL, GTextLabelNode, GTextLabelNodeView);

    // Edges
    configureModelElement(context, ClassDiagramEdgeTypes.ABSTRACTION, GAbstractionEdge, GAbstractionEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.ASSOCIATION, GAssociationEdge, GAssociationEdgeView);
    // Created from their own palette entries, and drawn as the association they are stored as.
    configureModelElement(context, ClassDiagramEdgeTypes.AGGREGATION, GAssociationEdge, GAssociationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.COMPOSITION, GAssociationEdge, GAssociationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.DEPENDENCY, GDependencyEdge, GDependencyEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.INTERFACE_REALIZATION, GInterfaceRealizationEdge, GInterfaceRealizationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.GENERALIZATION, GGeneralizationEdge, GGeneralizationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.REALIZATION, GRealizationEdge, GRealizationEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.SUBSTITUTION, GSubstitutionEdge, GSubstitutionEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.USAGE, GUsageEdge, GUsageEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.PACKAGE_IMPORT, GPackageImportEdge, GPackageImportEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.ELEMENT_IMPORT, GElementImportEdge, GElementImportEdgeView);
    configureModelElement(context, ClassDiagramEdgeTypes.PACKAGE_MERGE, GPackageMergeEdge, GPackageMergeEdgeView);
});
