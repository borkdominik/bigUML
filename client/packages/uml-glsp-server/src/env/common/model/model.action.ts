/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

export interface SemanticModelResource {
    uri: string;
    content: string;
}

/**
 * The request action to get the semantic root of the current model.
 */
export interface RequestSemanticModelAction extends RequestAction<SemanticModelResponseAction> {
    kind: typeof RequestSemanticModelAction.KIND;
}
export namespace RequestSemanticModelAction {
    export const KIND = 'requestSemanticModel';

    export function create(): RequestSemanticModelAction {
        return {
            kind: KIND,
            requestId: RequestAction.generateRequestId()
        };
    }
}

/**
 * Response action that carries the semantic root of the current model.
 * The content is the raw semantic (AST) object; serialization is handled automatically.
 */
export interface SemanticModelResponseAction extends ResponseAction {
    kind: typeof SemanticModelResponseAction.KIND;
    resource: SemanticModelResource;
}

export namespace SemanticModelResponseAction {
    export const KIND = 'semanticModelResponse';

    export function is(action: unknown): action is SemanticModelResponseAction {
        return Action.hasKind(action, KIND);
    }

    export function create(resource: SemanticModelResource, responseId = ''): SemanticModelResponseAction {
        return {
            kind: KIND,
            responseId,
            resource
        };
    }
}
