// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
    isAcceptEventAction,
    isActivity,
    isActivityFinalNode,
    isActivityParameterNode,
    isActivityPartition,
    isCentralBufferNode,
    isControlFlow,
    isDecisionNode,
    isFlowFinalNode,
    isForkNode,
    isInitialNode,
    isInputPin,
    isJoinNode,
    isMergeNode,
    isOpaqueAction,
    isOutputPin,
    isSendSignalAction
} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState, DiagramLanguageMetadata } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { DiagramLanguageMetadata as DiagramLanguageMetadataType } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { AcceptEventActionPropertyPaletteHandler } from './elements/accept-event-action.property-palette-handler.js';
import { ActivityPropertyPaletteHandler } from './elements/activity.property-palette-handler.js';
import { ActivityFinalNodePropertyPaletteHandler } from './elements/activity-final-node.property-palette-handler.js';
import { ActivityParameterNodePropertyPaletteHandler } from './elements/activity-parameter-node.property-palette-handler.js';
import { ActivityPartitionPropertyPaletteHandler } from './elements/activity-partition.property-palette-handler.js';
import { CentralBufferNodePropertyPaletteHandler } from './elements/central-buffer-node.property-palette-handler.js';
import { ControlFlowPropertyPaletteHandler } from './elements/control-flow.property-palette-handler.js';
import { DecisionNodePropertyPaletteHandler } from './elements/decision-node.property-palette-handler.js';
import { FlowFinalNodePropertyPaletteHandler } from './elements/flow-final-node.property-palette-handler.js';
import { ForkNodePropertyPaletteHandler } from './elements/fork-node.property-palette-handler.js';
import { InitialNodePropertyPaletteHandler } from './elements/initial-node.property-palette-handler.js';
import { InputPinPropertyPaletteHandler } from './elements/input-pin.property-palette-handler.js';
import { JoinNodePropertyPaletteHandler } from './elements/join-node.property-palette-handler.js';
import { MergeNodePropertyPaletteHandler } from './elements/merge-node.property-palette-handler.js';
import { OpaqueActionPropertyPaletteHandler } from './elements/opaque-action.property-palette-handler.js';
import { OutputPinPropertyPaletteHandler } from './elements/output-pin.property-palette-handler.js';
import { SendSignalActionPropertyPaletteHandler } from './elements/send-signal-action.property-palette-handler.js';
@injectable()
export class RequestActivityPropertyPaletteActionHandler implements ActionHandler {
    actionKinds = [RequestPropertyPaletteAction.KIND];

    @inject(DiagramModelState)
    protected modelState!: DiagramModelState;

    @inject(DiagramLanguageMetadata)
    protected languageMetadata!: DiagramLanguageMetadataType;

    execute(action: RequestPropertyPaletteAction): MaybePromise<any[]> {
        try {
            if (!action.elementId) {
                return [SetPropertyPaletteAction.create()];
            }
            if (typeof action.elementId !== 'string' || action.elementId.endsWith('_refValue')) {
                return [SetPropertyPaletteAction.create()];
            }

            let semanticElement: any | undefined;
            try {
                semanticElement = this.modelState.index.findIdElement(action.elementId);
            } catch {
                return [SetPropertyPaletteAction.create()];
            }
            if (!semanticElement) {
                return [SetPropertyPaletteAction.create()];
            }

            const context = { semanticElement, languageMetadata: this.languageMetadata };

            if (isSendSignalAction(semanticElement)) {
                return SendSignalActionPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isOutputPin(semanticElement)) {
                return OutputPinPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isOpaqueAction(semanticElement)) {
                return OpaqueActionPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isInputPin(semanticElement)) {
                return InputPinPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isMergeNode(semanticElement)) {
                return MergeNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isJoinNode(semanticElement)) {
                return JoinNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isInitialNode(semanticElement)) {
                return InitialNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isForkNode(semanticElement)) {
                return ForkNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isFlowFinalNode(semanticElement)) {
                return FlowFinalNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDecisionNode(semanticElement)) {
                return DecisionNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isControlFlow(semanticElement)) {
                return ControlFlowPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isCentralBufferNode(semanticElement)) {
                return CentralBufferNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isActivityPartition(semanticElement)) {
                return ActivityPartitionPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isActivityParameterNode(semanticElement)) {
                return ActivityParameterNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isActivityFinalNode(semanticElement)) {
                return ActivityFinalNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isActivity(semanticElement)) {
                return ActivityPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isAcceptEventAction(semanticElement)) {
                return AcceptEventActionPropertyPaletteHandler.getPropertyPalette(context);
            }

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
