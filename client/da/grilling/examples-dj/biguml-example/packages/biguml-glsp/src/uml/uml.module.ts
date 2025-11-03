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
import { GInteractableCompartment } from '../views/compartment';
import { UmlGModelTypes } from './uml.types';
import { GDivider, GDividerView } from './views/divider.view';
import { GIconCSS, GIconCSSView } from './views/icon.view';
import { GEditableLabel, GEditableLabelView } from './views/label.view';

export const umlModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UmlGModelTypes.LABEL_NAME, GEditableLabel, GEditableLabelView);
    configureModelElement(context, UmlGModelTypes.LABEL_EDGE_NAME, GEditableLabel, GEditableLabelView);
    configureModelElement(context, UmlGModelTypes.LABEL_TEXT, GLabel, GLabelView);
    configureModelElement(context, UmlGModelTypes.ICON_CSS, GIconCSS, GIconCSSView);
    configureModelElement(context, UmlGModelTypes.DIVIDER, GDivider, GDividerView);
    configureModelElement(context, UmlGModelTypes.COMPARTMENT_INTERACTABLE, GInteractableCompartment, GCompartmentView);
});
