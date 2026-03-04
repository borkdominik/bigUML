/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ModelState, type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { RequestSemanticModelAction, SemanticModelResponseAction } from '../../../common/index.js';
import type { DiagramModelState } from './diagram-model-state.js';

@injectable()
export class RequestSemanticModelActionHandler implements ActionHandler {
    actionKinds = [RequestSemanticModelAction.KIND];

    @inject(ModelState)
    readonly modelState: DiagramModelState;

    execute(action: RequestSemanticModelAction): MaybePromise<SemanticModelResponseAction[]> {
        return [SemanticModelResponseAction.create(JSON.parse(this.modelState.semanticText()), action.requestId)];
    }
}
