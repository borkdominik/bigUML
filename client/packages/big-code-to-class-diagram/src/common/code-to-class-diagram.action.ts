/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

// ========= This action will be handled by the GLSP Client =========


export type Option = 'Java' | 'Python' //| 'C++';

export interface RequestSelectFolderAction extends RequestAction<SelectedFolderResponseAction> {
    kind: typeof RequestSelectFolderAction.KIND;
}

export namespace RequestSelectFolderAction {
    export const KIND = 'requestSelectFolder';

    export function is(object: unknown): object is RequestSelectFolderAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(): RequestSelectFolderAction {
        return {
            kind: KIND,
            requestId: ''
        };
    }
}

export interface RequestChangeLanguageAction extends RequestAction<ChangeLanguageResponseAction> {
    kind: typeof RequestChangeLanguageAction.KIND;
    language: Option | null;
}

export namespace RequestChangeLanguageAction {
    export const KIND = 'requestSelectFolder';

    export function is(object: unknown): object is RequestChangeLanguageAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestChangeLanguageAction, 'kind' | 'requestId'>): RequestChangeLanguageAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}



export interface ChangeLanguageResponseAction extends ResponseAction {
    kind: typeof ChangeLanguageResponseAction.KIND;
    fileCount: number | null;
}

export namespace ChangeLanguageResponseAction {
    export const KIND = 'selectedFolderResponse';

    export function is(object: unknown): object is ChangeLanguageResponseAction {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<ChangeLanguageResponseAction, 'kind' | 'responseId'> & { responseId?: string }
    ): ChangeLanguageResponseAction {
        return {
            kind: KIND,
            responseId: '',
            fileCount: null,
            ...options
        };
    }
}


export interface SelectedFolderResponseAction extends ResponseAction {
    kind: typeof SelectedFolderResponseAction.KIND;
    folderPath: string | null;
    fileCount: number | null;
}

export namespace SelectedFolderResponseAction {
    export const KIND = 'selectedFolderResponse';

    export function is(object: unknown): object is SelectedFolderResponseAction {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<SelectedFolderResponseAction, 'kind' | 'responseId'> & { responseId?: string }
    ): SelectedFolderResponseAction {
        return {
            kind: KIND,
            responseId: '',
            folderPath: null,
            fileCount: null,
            ...options
        };
    }
}


export interface GenerateDiagramRequestAction extends RequestAction<GenerateDiagramResponseAction> {
    kind: typeof GenerateDiagramRequestAction.KIND;
}

export namespace GenerateDiagramRequestAction {
    export const KIND = 'generateDiagramRequest';

    export function is(object: unknown): object is GenerateDiagramRequestAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(): GenerateDiagramRequestAction {
        return {
            kind: KIND,
            requestId: ''
        };
    }
}

export interface GenerateDiagramResponseAction extends ResponseAction {
    kind: typeof GenerateDiagramResponseAction.KIND;
}

export namespace GenerateDiagramResponseAction {
    export const KIND = 'generateDiagramResponse';

    export function is(object: unknown): object is GenerateDiagramResponseAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): GenerateDiagramResponseAction {
        return {
            kind: KIND,
            responseId: ''
        };
    }
}