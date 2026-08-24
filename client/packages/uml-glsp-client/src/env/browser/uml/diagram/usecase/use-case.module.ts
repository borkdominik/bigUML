/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { configureModelElement, FeatureModule } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import {
    GActorNode,
    GActorNodeView,
    GAssociationEdge,
    GAssociationEdgeView,
    GExtendEdge,
    GExtendEdgeView,
    GGeneralizationEdge,
    GGeneralizationEdgeView,
    GIncludeEdge,
    GIncludeEdgeView,
    GNoteNode,
    GNoteNodeView,
    GSubjectNode,
    GSubjectNodeView,
    GTextLabelNode,
    GTextLabelNodeView,
    GUseCaseNode,
    GUseCaseNodeView,
    NamedElement,
    NamedElementView,
    StickFigureNode,
    StickFigureView
} from '../../elements/index.js';
import { GEditableLabel, GEditableLabelView } from '../../views/uml-label.view.js';

const R = 'usecase';

export const umlUseCaseDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Actor'), GActorNode, GActorNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'ActorStickfigure'), StickFigureNode, StickFigureView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'UseCase'), GUseCaseNode, GUseCaseNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Subject'), GSubjectNode, GSubjectNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Property'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Property'), GPropertyNode, GPropertyNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'PropertyType'), GEditableLabel, GEditableLabelView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'PropertyMultiplicity'), GEditableLabel, GEditableLabelView);

    // The note and the free label, which every diagram has: both say something about the diagram
    // rather than being part of any one notation.
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Note'), GNoteNode, GNoteNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'TextLabel'), GTextLabelNode, GTextLabelNodeView);

    // Edges
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Association'), GAssociationEdge, GAssociationEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Extend'), GExtendEdge, GExtendEdgeView);
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.EDGE, 'Generalization'),
        GGeneralizationEdge,
        GGeneralizationEdgeView
    );
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Include'), GIncludeEdge, GIncludeEdgeView);
});
