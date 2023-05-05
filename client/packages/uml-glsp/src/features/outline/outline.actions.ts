/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/client';
import { RequestAction, ResponseAction } from '@eclipse-glsp/protocol';

import { OutlineTreeNode } from './outline-tree-node.model';

export class SetOutlineAction implements ResponseAction {
    static readonly KIND = 'setOutlineAction';
    kind = SetOutlineAction.KIND;

    constructor(public responseId = '', public outlineTreeNodes: OutlineTreeNode[]) {}
}

export function isSetOutlineAction(action: Action): action is SetOutlineAction {
    return action.kind === SetOutlineAction.KIND;
}

export class RequestOutlineAction implements RequestAction<SetOutlineAction> {
    static readonly KIND = 'requestOutlineView';
    kind = RequestOutlineAction.KIND;

    constructor(public requestId: string = RequestAction.generateRequestId()) {}
}
