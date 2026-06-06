/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { configureModelElement, FeatureModule, GEdge, PolylineEdgeView } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { NamedElement, NamedElementView } from '../../elements/index.js';

const R = 'informationflow';

export const umlInformationFlowDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Class'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Class'), GClassNode, GClassNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Actor'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Actor'), GActorNode, GActorNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'ActorStickfigure'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'ActorStickfigure'), StickFigureNode, StickFigureView);

    // Edges
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'InformationFlow'), GEdge, PolylineEdgeView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'InformationFlow'), GInformationFlowEdge, GInformationFlowEdgeView);
});
