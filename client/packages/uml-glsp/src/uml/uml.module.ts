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
import { GUMLCompartment } from '../views/uml-compartment';
import { UMLGModelTypes } from './uml.types';
import { GCompartmentContainer } from './views/uml-compartment';
import { GDivider, GDividerView } from './views/uml-divider.view';
import { GIconCSS, GIconCSSView } from './views/uml-icon.view';
import { GEditableLabel, GEditableLabelView } from './views/uml-label.view';

export const umlModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UMLGModelTypes.LABEL_NAME, GEditableLabel, GEditableLabelView);
    configureModelElement(context, UMLGModelTypes.LABEL_EDGE_NAME, GEditableLabel, GEditableLabelView);
    configureModelElement(context, UMLGModelTypes.LABEL_TEXT, GLabel, GLabelView);
    configureModelElement(context, UMLGModelTypes.ICON_CSS, GIconCSS, GIconCSSView);
    configureModelElement(context, UMLGModelTypes.DIVIDER, GDivider, GDividerView);
    configureModelElement(context, UMLGModelTypes.COMPARTMENT_HEADER, GUMLCompartment, GCompartmentView);
    configureModelElement(context, UMLGModelTypes.COMPARTMENT_ROOT_COMPONENT, GUMLCompartment, GCompartmentView);
    configureModelElement(context, UMLGModelTypes.COMPARTMENT_CONTAINER, GCompartmentContainer, GCompartmentView);
});
