/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, hasObjectProp, type RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

import { type OutlineTreeNode } from './outline.model.js';

export interface RequestOutlineAction extends RequestAction<SetOutlineAction> {
    kind: typeof RequestOutlineAction.KIND;
}

export namespace RequestOutlineAction {
    export const KIND = 'requestOutline';

    export function is(object: any): object is RequestOutlineAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options?: { requestId?: string }): RequestOutlineAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface SetOutlineAction extends ResponseAction {
    kind: typeof SetOutlineAction.KIND;
    outlineTreeNodes: OutlineTreeNode[];
}

export namespace SetOutlineAction {
    export const KIND = 'setOutline';

    export function is(object: any): object is SetOutlineAction {
        return Action.hasKind(object, KIND) && hasObjectProp(object, 'outlineTreeNodes');
    }

    export function create(options: { responseId?: string; outlineTreeNodes: OutlineTreeNode[] }): SetOutlineAction {
        return {
            kind: KIND,
            responseId: '',
            ...options
        };
    }
}
