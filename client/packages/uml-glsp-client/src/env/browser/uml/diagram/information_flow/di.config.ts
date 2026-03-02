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
    GClassNode,
    GClassNodeView,
    GInformationFlowEdge,
    GInformationFlowEdgeView,
    StickFigureNode,
    StickFigureView
} from '../../elements/index.js';

const R = 'Information_Flow';

export const umlInformationFlowDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Class'), GClassNode, GClassNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Actor'), GActorNode, GActorNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'ActorStickfigure'), StickFigureNode, StickFigureView);

    // Edges
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.EDGE, 'InformationFlow'),
        GInformationFlowEdge,
        GInformationFlowEdgeView
    );
});
