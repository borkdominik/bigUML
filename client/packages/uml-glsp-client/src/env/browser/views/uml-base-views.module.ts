/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    configureDefaultModelElements,
    DefaultTypes,
    FeatureModule,
    GCompartmentView,
    GGraph,
    overrideModelElement,
    TYPES
} from '@eclipse-glsp/client';
import { CompartmentSelectionFeedback } from './processors/feedback.postprocessor.js';
import { SVGIdCreatorService } from './services/svg-id-creator.service.js';
import { GUmlCompartment } from './uml-compartment.js';
import { UmlGraphProjectionView } from './uml-graph-projection.view.js';

export const umlBaseViewsModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bind(TYPES.IVNodePostprocessor).to(CompartmentSelectionFeedback);
    bind(SVGIdCreatorService).toSelf().inSingletonScope();

    configureDefaultModelElements(context);

    overrideModelElement(context, DefaultTypes.GRAPH, GGraph, UmlGraphProjectionView);
    overrideModelElement(context, DefaultTypes.COMPARTMENT, GUmlCompartment, GCompartmentView);
});
