/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureModelElement, FeatureModule, GCompartmentView, GLabel, GLabelView } from '@eclipse-glsp/client';
import { GUMLCompartment } from '../views/uml-compartment.js';
import { UMLGModelTypes } from './uml.types.js';
import { GCompartmentContainer } from './views/uml-compartment.js';
import { GDivider, GDividerView } from './views/uml-divider.view.js';
import { GIconCSS, GIconCSSView } from './views/uml-icon.view.js';
import { GEditableLabel, GEditableLabelView } from './views/uml-label.view.js';

export const umlModule = new FeatureModule((bind, unbind, isBound, rebind) => {
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
