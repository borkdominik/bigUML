/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureModelElement, SLabel, SLabelView } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { IconCSS, IconCSSView, SEditableLabel } from '../index';
import { UmlTypes } from './uml.types';

export const umlModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UmlTypes.LABEL_NAME, SEditableLabel, SLabelView);
    configureModelElement(context, UmlTypes.LABEL_EDGE_NAME, SEditableLabel, SLabelView);
    configureModelElement(context, UmlTypes.LABEL_TEXT, SLabel, SLabelView);
    configureModelElement(context, UmlTypes.ICON_CSS, IconCSS, IconCSSView);
});
