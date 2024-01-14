/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { configureDefaultModelElements, configureModelElement, GCompartmentView, GGraph, TYPES } from '@eclipse-glsp/client';
import { DefaultTypes, FeatureModule } from '@eclipse-glsp/protocol';
import { GUmlCompartment } from './compartment';
import { CompartmentSelectionFeedback } from './processors/feedback.postprocessor';
import { SVGIdCreatorService } from './services/svg-id-creator.service';
import { UmlGraphProjectionView } from './uml-graph-projection.view';

export const umlBaseViewsModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bind(TYPES.IVNodePostprocessor).to(CompartmentSelectionFeedback);
    bind(SVGIdCreatorService).toSelf().inSingletonScope();

    configureDefaultModelElements(context);

    configureModelElement(context, DefaultTypes.GRAPH, GGraph, UmlGraphProjectionView);
    configureModelElement(context, DefaultTypes.COMPARTMENT, GUmlCompartment, GCompartmentView);
});
