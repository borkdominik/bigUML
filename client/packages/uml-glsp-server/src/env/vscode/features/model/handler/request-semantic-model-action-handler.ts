/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { RequestSemanticModelAction, SemanticModelResponseAction } from '@borkdominik-biguml/uml-glsp-server';
import { ModelState, type Action, type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import type { DiagramModelState } from '../diagram-model-state.js';

@injectable()
export class RequestSemanticModelActionHandler implements ActionHandler {
    actionKinds = [RequestSemanticModelAction.KIND];

    @inject(ModelState)
    readonly modelState: DiagramModelState;

    execute(action: RequestSemanticModelAction): MaybePromise<Action[]> {
        return [
            SemanticModelResponseAction.create(
                {
                    uri: this.modelState.semanticUri,
                    content: this.modelState.serializedSemanticRoot()
                },
                action.requestId
            )
        ];
    }
}
