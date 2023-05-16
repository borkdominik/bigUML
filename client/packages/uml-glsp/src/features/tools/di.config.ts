/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    ChangeBoundsTool,
    configureActionHandler,
    DelKeyDeleteTool,
    EdgeCreationTool,
    EnableDefaultToolsAction,
    EnableToolsAction,
    ManhattanEdgeRouter,
    MouseDeleteTool,
    NodeCreationTool,
    ToolManagerActionHandler,
    TYPES
} from '@eclipse-glsp/client';
import { GLSPToolManager } from '@eclipse-glsp/client/lib/base/tool-manager/glsp-tool-manager';
import { configureMarqueeTool } from '@eclipse-glsp/client/lib/features/tools/di.config';
import { GSLPManhattanEdgeRouter } from '@eclipse-glsp/client/lib/features/tools/glsp-manhattan-edge-router';
import { TriggerEdgeCreationAction, TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { ContainerModule } from 'inversify';
import { UmlEdgeEditTool } from './edge/edge-edit.tool';
import { ChangeToolsStateAction, UmlToolManager, UmlToolManagerActionHandler } from './tool-manager';

export const umlToolsModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    bind(UmlToolManager).toSelf().inSingletonScope();
    rebind(GLSPToolManager).toService(UmlToolManager);

    bind(UmlToolManagerActionHandler).toSelf().inSingletonScope();
    rebind(ToolManagerActionHandler).toService(UmlToolManagerActionHandler);
    configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, UmlToolManagerActionHandler);
    configureActionHandler({ bind, isBound }, EnableToolsAction.KIND, UmlToolManagerActionHandler);
    configureActionHandler({ bind, isBound }, ChangeToolsStateAction.KIND, UmlToolManagerActionHandler);

    // Register default tools
    bind(TYPES.IDefaultTool).to(ChangeBoundsTool);
    bind(TYPES.IDefaultTool).to(UmlEdgeEditTool);
    bind(TYPES.IDefaultTool).to(DelKeyDeleteTool);

    // Register  tools
    bind(TYPES.ITool).to(MouseDeleteTool);
    bind(NodeCreationTool).toSelf().inSingletonScope();
    bind(EdgeCreationTool).toSelf().inSingletonScope();
    bind(TYPES.ITool).toService(EdgeCreationTool);
    bind(TYPES.ITool).toService(NodeCreationTool);

    configureMarqueeTool({ bind, isBound });
    configureActionHandler({ bind, isBound }, TriggerNodeCreationAction.KIND, NodeCreationTool);
    configureActionHandler({ bind, isBound }, TriggerEdgeCreationAction.KIND, EdgeCreationTool);

    bind(GSLPManhattanEdgeRouter).toSelf().inSingletonScope();
    rebind(ManhattanEdgeRouter).toService(GSLPManhattanEdgeRouter);
});
