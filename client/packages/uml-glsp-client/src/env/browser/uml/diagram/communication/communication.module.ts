/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { bindOrRebind, configureModelElement, EdgeLayoutPostprocessor, FeatureModule, GEdge, PolylineEdgeView } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import {
    GInteractionNode,
    GInteractionNodeView,
    GMessageArrowLabel,
    MessageArrowLabelView,
    MessageArrowLayoutPostprocessor,
    NamedElement,
    NamedElementView
} from '../../elements/index.js';

const R = 'Communication';

export const umlCommunicationDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Interaction'), GInteractionNode, GInteractionNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Lifeline'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Lifeline'), GLifelineNode, GLifelineNodeView);

    // Edges
    // The message label draws its own arrow beside the link - see `MessageArrowLabelView` - and is
    // placed by the arrow rather than by the label's own corner, so that the messages on either side
    // of a link are held the same distance off it however long their names are. The link itself stays
    // a plain line: in a communication diagram it is the association between two lifelines and has no
    // direction of its own, so it must not carry an arrow head.
    bindOrRebind(context, EdgeLayoutPostprocessor).to(MessageArrowLayoutPostprocessor).inSingletonScope();
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.LABEL, 'message-arrow-edge-name'),
        GMessageArrowLabel,
        MessageArrowLabelView
    );
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Message'), GEdge, PolylineEdgeView);
});
