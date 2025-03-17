/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, ResponseAction } from '@eclipse-glsp/protocol';

export interface BGModelResource {
    uri: string;
    content: string;
}

export interface RequestModelResourcesAction extends RequestAction<ModelResourcesResponseAction> {
    kind: typeof RequestModelResourcesAction.KIND;
}
export namespace RequestModelResourcesAction {
    export const KIND = 'requestModelResources';

    export function create(): RequestModelResourcesAction {
        return {
            kind: KIND,
            requestId: RequestAction.generateRequestId()
        };
    }
}

export interface ModelResourcesResponseAction extends ResponseAction {
    kind: typeof ModelResourcesResponseAction.KIND;
    resources: Record<string, BGModelResource>;
}

export namespace ModelResourcesResponseAction {
    export const KIND = 'modelResourcesResponse';

    export function is(action: unknown): action is ModelResourcesResponseAction {
        return Action.hasKind(action, KIND);
    }
}
