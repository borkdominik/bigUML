/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, hasStringProp } from '@eclipse-glsp/protocol';

export type UMLTheme = 'dark' | 'light';

export interface SetUMLThemeAction extends Action {
    kind: typeof SetUMLThemeAction.KIND;
    theme: UMLTheme;
}

export namespace SetUMLThemeAction {
    export const KIND = 'setUMLTheme';

    export function is(object: any): object is SetUMLThemeAction {
        return Action.hasKind(object, KIND) && hasStringProp(object, 'theme');
    }

    export function create(theme: UMLTheme): SetUMLThemeAction {
        return { kind: KIND, theme };
    }
}
