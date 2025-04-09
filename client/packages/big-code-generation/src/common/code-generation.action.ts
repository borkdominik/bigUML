/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

import { type CodeGenerationOptions, type JavaCodeGenerationOptions } from '../types/config.js';

// ========= This action will be handled by the GLSP Client =========

export interface RequestCodeGenerationAction extends RequestAction<CodeGenerationActionResponse> {
    kind: typeof RequestCodeGenerationAction.KIND;
    options: CodeGenerationOptions;
    language: string | null;
    languageOptions: JavaCodeGenerationOptions | null;
}

export namespace RequestCodeGenerationAction {
    export const KIND = 'requestCodeGeneration';

    export function is(object: unknown): object is RequestCodeGenerationAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestCodeGenerationAction, 'kind' | 'requestId'>): RequestCodeGenerationAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface CodeGenerationActionResponse extends ResponseAction {
    kind: typeof CodeGenerationActionResponse.KIND;
    success: boolean;
}

export namespace CodeGenerationActionResponse {
    export const KIND = 'codeGenerationResponse';

    export function is(object: unknown): object is CodeGenerationActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<CodeGenerationActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): CodeGenerationActionResponse {
        return {
            kind: KIND,
            responseId: '',
            success: false,
            ...options
        };
    }
}

export interface RequestSelectSourceCodeFolderAction extends RequestAction<SelectSourceCodeFolderActionResponse> {
    kind: typeof RequestSelectSourceCodeFolderAction.KIND;
}

export namespace RequestSelectSourceCodeFolderAction {
    export const KIND = 'requestSourceCodeSelectFolder';

    export function is(object: unknown): object is RequestSelectSourceCodeFolderAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestSelectSourceCodeFolderAction, 'kind' | 'requestId'>): RequestSelectSourceCodeFolderAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface SelectSourceCodeFolderActionResponse extends ResponseAction {
    kind: typeof SelectSourceCodeFolderActionResponse.KIND;
    folder: string | null;
}

export namespace SelectSourceCodeFolderActionResponse {
    export const KIND = 'selectSourceCodeFolderResponse';

    export function is(object: unknown): object is SelectSourceCodeFolderActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<SelectSourceCodeFolderActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): SelectSourceCodeFolderActionResponse {
        return {
            kind: KIND,
            responseId: '',
            folder: null,
            ...options
        };
    }
}

export interface RequestSelectTemplateFileAction extends RequestAction<SelectTemplateFileActionResponse> {
    kind: typeof RequestSelectTemplateFileAction.KIND;
}

export namespace RequestSelectTemplateFileAction {
    export const KIND = 'requestTemplateSelectFile';

    export function is(object: unknown): object is RequestSelectTemplateFileAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestSelectTemplateFileAction, 'kind' | 'requestId'>): RequestSelectTemplateFileAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface SelectTemplateFileActionResponse extends ResponseAction {
    kind: typeof SelectTemplateFileActionResponse.KIND;
    file: string | null;
}

export namespace SelectTemplateFileActionResponse {
    export const KIND = 'selectTemplateFileResponse';

    export function is(object: unknown): object is SelectTemplateFileActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<SelectTemplateFileActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): SelectTemplateFileActionResponse {
        return {
            kind: KIND,
            responseId: '',
            file: null,
            ...options
        };
    }
}
