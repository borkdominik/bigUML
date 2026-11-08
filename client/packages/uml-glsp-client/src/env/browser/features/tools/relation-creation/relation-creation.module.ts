/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    bindAsService,
    configureActionHandler,
    configureCommand,
    configureView,
    edgeCreationToolModule,
    FeatureModule,
    TYPES
} from '@eclipse-glsp/client';
import { RelationCreationTool, StartRelationCreationAction } from './relation-creation-tool.js';
import { HideRelationHandlesCommand, ShowRelationHandlesCommand } from './relation-handle-feedback.js';
import { RelationHandleTool } from './relation-handle-tool.js';
import { GRelationHandle, GRelationHandleView } from './relation-handle.js';
import { RelationTypePicker } from './relation-type-picker.js';

/**
 * The "Create relation" tool, started from the arrows a selected shape shows on its sides, plus the
 * picker the tool chooses the relation's type with.
 */
export const umlRelationCreationModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindAsService(context, TYPES.IUIExtension, RelationTypePicker);
        bindAsService(context, TYPES.ITool, RelationCreationTool);
        configureActionHandler(context, StartRelationCreationAction.KIND, RelationCreationTool);

        bindAsService(context, TYPES.IDefaultTool, RelationHandleTool);
        configureCommand(context, ShowRelationHandlesCommand);
        configureCommand(context, HideRelationHandlesCommand);
        configureView(context, GRelationHandle.TYPE, GRelationHandleView);
    },
    {
        // The feedback edge drawn while the target is picked is the edge creation tool's.
        requires: edgeCreationToolModule
    }
);
