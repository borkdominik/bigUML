/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

/**
 * The type of the model resources.
 */
export type ModelResourceFormat = 'json' | 'xml';

/**
 * The request action to get the model resources.
 */
export interface RequestModelResourcesAction extends RequestAction<ModelResourcesResponseAction> {
    kind: typeof RequestModelResourcesAction.KIND;
    /**
     * If set, the request will only return the resources with the given formats.
     * If not set, all formats will be returned.
     */
    formats?: ModelResourceFormat[];
}
export namespace RequestModelResourcesAction {
    export const KIND = 'requestModelResources';

    export function create(options: Omit<RequestModelResourcesAction, 'kind' | 'requestId'>): RequestModelResourcesAction {
        return {
            kind: KIND,
            requestId: RequestAction.generateRequestId(),
            ...options
        };
    }
}

/**
 * The model resource represents the conctent of a model in a specific format.
 * The content is the serialized model in the given format.
 */
export interface ModelResource {
    content: string;
    format: ModelResourceFormat;
    uri: string;
}

export interface ModelResourcesResponseAction extends ResponseAction {
    kind: typeof ModelResourcesResponseAction.KIND;
    resources: Record<string, ModelResource>;
}

export namespace ModelResourcesResponseAction {
    export const KIND = 'modelResourcesResponse';

    export function is(action: unknown): action is ModelResourcesResponseAction {
        return Action.hasKind(action, KIND);
    }
}
