/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { bindAsService, edgeCreationToolModule, FeatureModule, TYPES } from '@eclipse-glsp/client';
import { RelationCreationTool } from './relation-creation-tool.js';
import { RelationTypePicker } from './relation-type-picker.js';

/** The "Create relation" tool of the tool palette, and the picker it chooses the relation's type with. */
export const umlRelationCreationModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindAsService(context, TYPES.IUIExtension, RelationTypePicker);
        bindAsService(context, TYPES.ITool, RelationCreationTool);
    },
    {
        // The feedback edge drawn while the target is picked is the edge creation tool's.
        requires: edgeCreationToolModule
    }
);
