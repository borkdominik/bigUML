/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, hasArrayProp, hasStringProp, type Bounds } from '@eclipse-glsp/protocol';

// Accessibility
// THE FOLLOWING CODE IS NOT CORRECTLY EXPORTED BY GLSP

export interface FocusDomAction extends Action {
    kind: typeof FocusDomAction.KIND;
    id: string;
}

export namespace FocusDomAction {
    export const KIND = 'focusDomAction';

    export function is(object: any): object is FocusDomAction {
        return Action.hasKind(object, KIND) && hasStringProp(object, 'id');
    }

    export function create(id: string): FocusDomAction {
        return { kind: KIND, id };
    }
}

// node_modules/@eclipse-glsp/client/src/base/tool-manager/tool.ts

/**
 * Action to enable the tools of the specified `toolIds`.
 */
export interface EnableToolsAction extends Action {
    kind: typeof EnableToolsAction.KIND;
    toolIds: string[];
}
export namespace EnableToolsAction {
    export const KIND = 'enable-tools';

    export function is(object: unknown): object is EnableToolsAction {
        return Action.hasKind(object, KIND) && hasArrayProp(object, 'toolIds');
    }

    export function create(toolIds: string[]): EnableToolsAction {
        return {
            kind: KIND,
            toolIds
        };
    }
}

/**
 * Action to disable the currently active tools and enable the default tools instead.
 */
export interface EnableDefaultToolsAction extends Action {
    kind: typeof EnableDefaultToolsAction.KIND;
}
export namespace EnableDefaultToolsAction {
    export const KIND = 'enable-default-tools';

    export function is(object: unknown): object is EnableToolsAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): EnableDefaultToolsAction {
        return {
            kind: KIND
        };
    }
}

// node_modules/@eclipse-glsp/sprotty/node_modules/sprotty/src/base/features/initialize-canvas.ts

export interface InitializeCanvasBoundsAction extends Action {
    kind: typeof InitializeCanvasBoundsAction.KIND;
    newCanvasBounds: Bounds;
}
export namespace InitializeCanvasBoundsAction {
    export const KIND = 'initializeCanvasBounds';

    export function create(newCanvasBounds: Bounds): InitializeCanvasBoundsAction {
        return {
            kind: KIND,
            newCanvasBounds
        };
    }
}
