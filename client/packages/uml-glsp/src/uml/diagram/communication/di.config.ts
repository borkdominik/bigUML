/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { configureModelElement, SEdge } from '@eclipse-glsp/client/lib';
import { ContainerModule } from 'inversify';

import { IconView, SEditableLabel } from '../../../index';
import { NamedElement } from '../../elements/named-element.model';
import { NamedElementView } from '../../elements/named-element.view';
import { UmlCommunicationTypes } from './communication.types';
import { IconInteraction } from './elements/interaction/model';
import { IconLifeline } from './elements/lifeline';
import { MessageArrowLabelView, MessageEdgeView } from './elements/message';

export const umlCommunicationDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Interaction
    configureModelElement(context, UmlCommunicationTypes.ICON_INTERACTION, IconInteraction, IconView);
    configureModelElement(context, UmlCommunicationTypes.INTERACTION, NamedElement, NamedElementView);

    // Lifeline
    configureModelElement(context, UmlCommunicationTypes.ICON_LIFELINE, IconLifeline, IconView);
    configureModelElement(context, UmlCommunicationTypes.LIFELINE, NamedElement, NamedElementView);

    // Message
    configureModelElement(context, UmlCommunicationTypes.MESSAGE, SEdge, MessageEdgeView);
    configureModelElement(context, UmlCommunicationTypes.MESSAGE_LABEL_ARROW_EDGE_NAME, SEditableLabel, MessageArrowLabelView);
});
