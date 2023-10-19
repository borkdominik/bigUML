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
    DelKeyDeleteTool,
    EnableDefaultToolsAction,
    EnableToolsAction,
    GLSPScrollMouseListener,
    ManhattanEdgeRouter,
    MouseDeleteTool,
    NodeCreationTool,
    ToolManagerActionHandler,
    configureActionHandler,
    configureModelElement
} from '@eclipse-glsp/client';
import { MARQUEE } from '@eclipse-glsp/client/lib/features/tool-feedback/marquee-tool-feedback';
import { GSLPManhattanEdgeRouter } from '@eclipse-glsp/client/lib/features/tools/glsp-manhattan-edge-router';
import { MarqueeMouseTool } from '@eclipse-glsp/client/lib/features/tools/marquee-mouse-tool';
import { MarqueeTool } from '@eclipse-glsp/client/lib/features/tools/marquee-tool';
import { MarqueeNode } from '@eclipse-glsp/client/lib/features/tools/model';
import { MarqueeView } from '@eclipse-glsp/client/lib/features/tools/view';
import { TriggerEdgeCreationAction, TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { ContainerModule, interfaces } from 'inversify';
import { TYPES } from '../../base/types';
import { HORIZONTAL_SHIFT } from '../tool-feedback/horizontal-shift-tool-feedback';
import { VERTICAL_SHIFT } from '../tool-feedback/vertical-shift-tool-feedback';
import { UMLScrollMouseListener } from '../viewport/uml-scroll-mouse-listener';
import { UmlEdgeCreationTool } from './edge-creation-tool.extension';
import { HorizontalShiftNode, VerticalShiftNode } from './model';
import { ShiftMouseTool } from './shift-mouse-tool';
import { ShiftTool } from './shift-tool';
import { HorizontalShiftView, VerticalShiftView } from './shift-tool-view';
import { GLSPToolManager } from '@eclipse-glsp/client/lib/base/tool-manager/glsp-tool-manager';
import { UmlToolManager, UmlToolManagerActionHandler, ChangeToolsStateAction } from './tool-manager';
import { UmlEdgeEditTool } from './edge/edge-edit.tool';

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
    bind(UmlEdgeCreationTool).toSelf().inSingletonScope();
    bind(TYPES.ITool).toService(UmlEdgeCreationTool);
    bind(TYPES.ITool).toService(NodeCreationTool);

    configureMarqueeTool({ bind, isBound });
    configureShiftTool({ bind, isBound });

    configureActionHandler({ bind, isBound }, TriggerNodeCreationAction.KIND, NodeCreationTool);
    configureActionHandler({ bind, isBound }, TriggerEdgeCreationAction.KIND, UmlEdgeCreationTool);

    bind(GSLPManhattanEdgeRouter).toSelf().inSingletonScope();
    rebind(ManhattanEdgeRouter).toService(GSLPManhattanEdgeRouter);

    bind(UMLScrollMouseListener).toSelf().inSingletonScope();
    rebind(GLSPScrollMouseListener).toService(UMLScrollMouseListener);
});

export function configureMarqueeTool(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
    configureModelElement(context, MARQUEE, MarqueeNode, MarqueeView);
    context.bind(TYPES.IDefaultTool).to(MarqueeTool);
    context.bind(TYPES.ITool).to(MarqueeMouseTool);
}
export function configureShiftTool(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
    configureModelElement(context, VERTICAL_SHIFT, VerticalShiftNode, VerticalShiftView);
    configureModelElement(context, HORIZONTAL_SHIFT, HorizontalShiftNode, HorizontalShiftView);
    context.bind(TYPES.IDefaultTool).to(ShiftTool);
    context.bind(TYPES.ITool).to(ShiftMouseTool);
}
