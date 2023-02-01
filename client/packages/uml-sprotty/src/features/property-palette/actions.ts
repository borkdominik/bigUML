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
import { Action } from "@eclipse-glsp/client";
import { generateRequestId, RequestAction, ResponseAction } from "@eclipse-glsp/protocol";

import { PropertyPalette } from "./model";

export class SetPropertyPaletteAction implements ResponseAction {
    static readonly KIND = "setPropertyPalette";
    kind = SetPropertyPaletteAction.KIND;

    constructor(
        public responseId = "",
        public palette: PropertyPalette
    ) { }
}

export function isSetPropertyPaletteAction(
    action: Action
): action is SetPropertyPaletteAction {
    return action.kind === SetPropertyPaletteAction.KIND;
}

export class RequestPropertyPaletteAction implements RequestAction<SetPropertyPaletteAction> {
    static readonly KIND = "requestPropertyPalette";
    kind = RequestPropertyPaletteAction.KIND;

    constructor(
        public elementId?: string,
        public requestId: string = generateRequestId()) { }
}

export class UpdateElementPropertyAction implements Action {
    static readonly KIND = "updateElementProperty";
    kind = UpdateElementPropertyAction.KIND;

    constructor(
        public elementId: string,
        public propertyId: string,
        public value: string
    ) { }
}

export function isUpdateElementPropertyAction(
    action: Action
): action is UpdateElementPropertyAction {
    return action.kind === UpdateElementPropertyAction.KIND;
}

export class EnablePropertyPaletteAction implements Action {
    static readonly KIND = "enablePropertyPalette";
    kind = EnablePropertyPaletteAction.KIND;

}

export function isEnablePropertyPaletteAction(
    action: Action
): action is EnablePropertyPaletteAction {
    return action.kind === EnablePropertyPaletteAction.KIND;
}
