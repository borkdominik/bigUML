/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, type Bounds, type ExportSvgOptions, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

/**
 * A `RequestMinimapExportSvgAction` is sent by the client to initiate the SVG export of the current diagram.
 * The handler of this action is expected to retrieve the diagram SVG and should send a {@link MinimapExportSvgAction} as response.
 */
export interface RequestMinimapExportSvgAction extends RequestAction<MinimapExportSvgAction> {
    kind: typeof RequestMinimapExportSvgAction.KIND;
    options?: ExportSvgOptions;
}
export namespace RequestMinimapExportSvgAction {
    export const KIND = 'requestMinimapExportSvg';

    export function is(object: unknown): object is RequestMinimapExportSvgAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: { requestId?: string } = {}): RequestMinimapExportSvgAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

/**
 * The client sends an `MinimapExportSvgAction` to indicate that the diagram, which represents the current model state,
 * should be exported in SVG format. The action provides the diagram SVG as plain string, the elementId of the model and the model bounds
 */
export interface MinimapExportSvgAction extends ResponseAction {
    kind: typeof MinimapExportSvgAction.KIND;
    svg?: string;
    elementId?: string;
    bounds?: Bounds;
}
export namespace MinimapExportSvgAction {
    export const KIND = 'minimapExportSvg';

    export function is(object: unknown): object is MinimapExportSvgAction {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<MinimapExportSvgAction, 'kind' | 'responseId'> & { responseId?: string }
    ): MinimapExportSvgAction {
        return {
            kind: KIND,
            responseId: '',
            ...options
        } as any;
    }
}
