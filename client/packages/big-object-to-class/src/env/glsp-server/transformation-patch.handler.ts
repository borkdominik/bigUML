/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ApplyModelPatchResponse, RequestApplyModelPatchAction } from '../common/transformation.action.js';
import { ModelPatchCommand } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { type Action, type ActionHandler, ModelState, ModelSubmissionHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import type { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';

/**
 * GLSP server-side handler that receives JSON patches from the VSCode host
 * and applies them to the current model via PatchManager.
 */
@injectable()
export class ApplyModelPatchActionHandler implements ActionHandler {
    actionKinds = [RequestApplyModelPatchAction.KIND];

    @inject(ModelState)
    readonly modelState: DiagramModelState;
    @inject(ModelSubmissionHandler)
    protected readonly modelSubmissionHandler: ModelSubmissionHandler;

    async execute(action: RequestApplyModelPatchAction): Promise<Action[]> {
        try {
            const command = new ModelPatchCommand(this.modelState, action.patches);
            await command.execute();
            const modelUpdateActions = await this.modelSubmissionHandler.submitModel();
            return [...modelUpdateActions, ApplyModelPatchResponse.create({ success: true, responseId: action.requestId })];
        } catch (error) {
            return [
                ApplyModelPatchResponse.create({
                    success: false,
                    responseId: action.requestId,
                    message: error instanceof Error ? error.message : String(error)
                })
            ];
        }
    }
}
