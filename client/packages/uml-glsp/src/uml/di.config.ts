/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureModelElement, GCompartmentView, GLabel, GLabelView } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { SDivider, SDividerView } from '../features/graph/views/divider.view';
import { IconCSS, IconCSSView, InteractableCompartment, SEditableLabel, SEditableLabelView } from '../index';
import { UmlGModelTypes } from './uml.types';

export const umlModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UmlGModelTypes.LABEL_NAME, SEditableLabel, SEditableLabelView);
    configureModelElement(context, UmlGModelTypes.LABEL_EDGE_NAME, SEditableLabel, SEditableLabelView);
    configureModelElement(context, UmlGModelTypes.LABEL_TEXT, GLabel, GLabelView);
    configureModelElement(context, UmlGModelTypes.ICON_CSS, IconCSS, IconCSSView);
    configureModelElement(context, UmlGModelTypes.DIVIDER, SDivider, SDividerView);
    configureModelElement(context, UmlGModelTypes.COMPARTMENT_INTERACTABLE, InteractableCompartment, GCompartmentView);
});
