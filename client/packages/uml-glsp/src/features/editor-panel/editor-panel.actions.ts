/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, RequestAction, ResponseAction } from '@eclipse-glsp/client';

export class EnableEditorPanelAction implements Action {
    static readonly KIND = 'enableEditorPanel';
    kind = EnableEditorPanelAction.KIND;
}

export function isEnableEditorPanelAction(action: Action): action is EnableEditorPanelAction {
    return action.kind === EnableEditorPanelAction.KIND;
}

export class RequestEditorPanelAction implements RequestAction<SetEditorPanelAction> {
    static readonly KIND = 'requestEditorPanel';
    kind = RequestEditorPanelAction.KIND;

    constructor(public requestId: string = RequestAction.generateRequestId()) {}
}

export class SetEditorPanelAction implements ResponseAction {
    static readonly KIND = 'setEditorPanel';
    kind = SetEditorPanelAction.KIND;

    constructor(public responseId = '', public children: string[]) {}
}

export function isSetEditorPanelAction(action: Action): action is SetEditorPanelAction {
    return action.kind === SetEditorPanelAction.KIND;
}
