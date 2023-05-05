/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, hasStringProp } from '@eclipse-glsp/protocol';
import type { UmlTheme } from './theme.manager';

export interface SetUmlThemeAction extends Action {
    kind: typeof SetUmlThemeAction.KIND;
    theme: UmlTheme;
}

export namespace SetUmlThemeAction {
    export const KIND = 'setUmlTheme';

    export function is(object: any): object is SetUmlThemeAction {
        return Action.hasKind(object, KIND) && hasStringProp(object, 'theme');
    }

    export function create(theme: UmlTheme): SetUmlThemeAction {
        return { kind: KIND, theme };
    }
}
