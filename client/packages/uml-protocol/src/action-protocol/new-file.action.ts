/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, type JsonMap, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

export interface RequestNewFileAction extends RequestAction<NewFileResponseAction> {
    kind: typeof RequestNewFileAction.KIND;
    diagramType: string;
    options?: JsonMap;
}
export namespace RequestNewFileAction {
    export const KIND = 'requestNewFile';

    export function create(diagramType: string, sourceUri: string): RequestNewFileAction {
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

export interface NewFileResponseAction extends ResponseAction {
    kind: typeof NewFileResponseAction.KIND;
    sourceUri: string;
}

export namespace NewFileResponseAction {
    export const KIND = 'newFileResponse';

    export function is(action: unknown): action is NewFileResponseAction {
        return Action.hasKind(action, KIND);
    }
}
