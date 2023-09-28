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
import { SDivider, SDividerView } from '../graph/base/divider.view';
import { IconCSS, IconCSSView, SEditableLabel } from '../index';
import { UmlGModelTypes } from './uml.types';

export const umlModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UmlGModelTypes.LABEL_NAME, SEditableLabel, SLabelView);
    configureModelElement(context, UmlGModelTypes.LABEL_EDGE_NAME, SEditableLabel, SLabelView);
    configureModelElement(context, UmlGModelTypes.LABEL_TEXT, SLabel, SLabelView);
    configureModelElement(context, UmlGModelTypes.ICON_CSS, IconCSS, IconCSSView);
    configureModelElement(context, UmlGModelTypes.DIVIDER, SDivider, SDividerView);
});
