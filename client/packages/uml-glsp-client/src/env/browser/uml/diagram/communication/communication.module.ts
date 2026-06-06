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
import { GEditableLabel, GEditableLabelView } from '../../views/uml-label.view.js';

const R = 'Communication';

export const umlCommunicationDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Interaction'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Interaction'), GInteractionNode, GInteractionNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Lifeline'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Lifeline'), GLifelineNode, GLifelineNodeView);

    // Edges
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.LABEL, 'message-arrow-edge-name'),
        GEditableLabel,
        GEditableLabelView
    );
    // configureModelElement(context, representationTypeId(R, DefaultTypes.LABEL, 'message-arrow-edge-name'), GEditableLabel, MessageArrowLabelView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Message'), GEdge, PolylineEdgeView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Message'), GMessageEdge, GMessageEdgeView);
});
