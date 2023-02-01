/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { Action, generateRequestId, RequestAction, ResponseAction } from "@eclipse-glsp/client";

export class EnableEditorPanelAction implements Action {
    static readonly KIND = "enableEditorPanel";
    kind = EnableEditorPanelAction.KIND;
}

export function isEnableEditorPanelAction(
    action: Action
): action is EnableEditorPanelAction {
    return action.kind === EnableEditorPanelAction.KIND;
}

export class RequestEditorPanelAction implements RequestAction<SetEditorPanelAction> {
    static readonly KIND = "requestEditorPanel";
    kind = RequestEditorPanelAction.KIND;

    constructor(
        public requestId: string = generateRequestId()) { }
}

export class SetEditorPanelAction implements ResponseAction {
    static readonly KIND = "setEditorPanel";
    kind = SetEditorPanelAction.KIND;

    constructor(
        public responseId = "",
        public children: string[]
    ) { }
}

export function isSetEditorPanelAction(
    action: Action
): action is SetEditorPanelAction {
    return action.kind === SetEditorPanelAction.KIND;
}
