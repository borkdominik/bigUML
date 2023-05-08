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

import { PropertyPalette } from './property-palette.model';

export class RequestPropertyPaletteAction implements RequestAction<SetPropertyPaletteAction> {
    static readonly KIND = 'requestPropertyPalette';
    kind = RequestPropertyPaletteAction.KIND;

    constructor(public elementId?: string, public requestId: string = RequestAction.generateRequestId()) {}
}

export class SetPropertyPaletteAction implements ResponseAction {
    static readonly KIND = 'setPropertyPalette';
    kind = SetPropertyPaletteAction.KIND;

    constructor(public responseId = '', public palette?: PropertyPalette) {}
}

export function isSetPropertyPaletteAction(action: Action): action is SetPropertyPaletteAction {
    return action.kind === SetPropertyPaletteAction.KIND;
}

export class UpdateElementPropertyAction implements Action {
    static readonly KIND = 'updateElementProperty';
    kind = UpdateElementPropertyAction.KIND;

    constructor(public elementId: string, public propertyId: string, public value: string) {}
}

export function isUpdateElementPropertyAction(action: Action): action is UpdateElementPropertyAction {
    return action.kind === UpdateElementPropertyAction.KIND;
}
