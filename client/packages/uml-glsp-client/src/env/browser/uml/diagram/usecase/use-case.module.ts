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
    GAggregationEdge,
    GAggregationEdgeView,
    GAssociationEdge,
    GAssociationEdgeView,
    GCompositionEdge,
    GCompositionEdgeView,
    GExtendEdge,
    GExtendEdgeView,
    GGeneralizationEdge,
    GGeneralizationEdgeView,
    GIncludeEdge,
    GIncludeEdgeView,
    GPropertyNode,
    GPropertyNodeView,
    GSubjectNode,
    GSubjectNodeView,
    GUseCaseNode,
    GUseCaseNodeView,
    StickFigureNode,
    StickFigureView
} from '../../elements/index.js';
import { GEditableLabel, GEditableLabelView } from '../../views/uml-label.view.js';

const R = 'Use_Case';

export const umlUseCaseDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Actor'), GActorNode, GActorNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'ActorStickfigure'), StickFigureNode, StickFigureView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'UseCase'), GUseCaseNode, GUseCaseNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Component'), GSubjectNode, GSubjectNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Property'), GPropertyNode, GPropertyNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'PropertyType'), GEditableLabel, GEditableLabelView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'PropertyMultiplicity'), GEditableLabel, GEditableLabelView);

    // Edges
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Association'), GAssociationEdge, GAssociationEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Aggregation'), GAggregationEdge, GAggregationEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Composition'), GCompositionEdge, GCompositionEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Extend'), GExtendEdge, GExtendEdgeView);
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.EDGE, 'Generalization'),
        GGeneralizationEdge,
        GGeneralizationEdgeView
    );
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Include'), GIncludeEdge, GIncludeEdgeView);
});
