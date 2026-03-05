/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

export interface CreateNewFileAction extends RequestAction<CreateNewFileResponseAction> {
    kind: typeof CreateNewFileAction.KIND;
    diagramType: string;
    options: {
        sourceUri: string;
    };
}

export namespace CreateNewFileAction {
    export const KIND = 'createNewFile';

    export function create(diagramType: string, sourceUri: string): CreateNewFileAction {
        return {
            kind: KIND,
            options: {
                sourceUri
            },
            diagramType,
            requestId: RequestAction.generateRequestId()
        };
    }
}

export interface CreateNewFileResponseAction extends ResponseAction {
    kind: typeof CreateNewFileResponseAction.KIND;
    sourceUri: string;
}

export namespace CreateNewFileResponseAction {
    export const KIND = 'createNewFileResponse';

    export function is(action: unknown): action is CreateNewFileResponseAction {
        return Action.hasKind(action, KIND);
    }

    export function create(sourceUri: string, responseId = ''): CreateNewFileResponseAction {
        return {
            kind: KIND,
            responseId,
            sourceUri
        };
    }
}
