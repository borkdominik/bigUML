/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { configureModelElement, FeatureModule, GCompartmentView, GLabel, GLabelView } from '@eclipse-glsp/client';
import { GUmlCompartment } from '../views/uml-compartment.js';
import { GCompartmentContainer } from './views/uml-compartment.js';
import { GDivider, GDividerView } from './views/uml-divider.view.js';
import { GIconCSS, GIconCSSView } from './views/uml-icon.view.js';
import { GEditableLabel, GEditableLabelView } from './views/uml-label.view.js';

export const umlModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, CommonModelTypes.LABEL_NAME, GEditableLabel, GEditableLabelView);
    configureModelElement(context, CommonModelTypes.LABEL_EDGE_NAME, GEditableLabel, GEditableLabelView);
    configureModelElement(context, CommonModelTypes.LABEL_TEXT, GLabel, GLabelView);
    configureModelElement(context, CommonModelTypes.ICON_CSS, GIconCSS, GIconCSSView);
    configureModelElement(context, CommonModelTypes.DIVIDER, GDivider, GDividerView);
    configureModelElement(context, CommonModelTypes.COMP_HEADER, GUmlCompartment, GCompartmentView);
    configureModelElement(context, CommonModelTypes.COMP_ROOT_COMPONENT, GUmlCompartment, GCompartmentView);
    configureModelElement(context, CommonModelTypes.COMP_CONTAINER, GCompartmentContainer, GCompartmentView);
});
