/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/*
import { bindOrRebind, DrawFeedbackEdgeSourceCommand, EdgeEditTool, edgeEditToolModule, FeatureModule } from '@eclipse-glsp/client';
import { UMLDrawFeedbackEdgeSourceCommand } from './edge-edit-tool-feedback.js';
import { UMLEdgeEditTool } from './edge-edit.tool.js';

export const umlEdgeEditToolModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, EdgeEditTool).to(UMLEdgeEditTool).inSingletonScope();
        bindOrRebind(context, DrawFeedbackEdgeSourceCommand).to(UMLDrawFeedbackEdgeSourceCommand).inSingletonScope();
    },
    {
        requires: edgeEditToolModule
    }
);
*/
