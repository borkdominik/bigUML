/**
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Export actions for instance export via templates
 */
import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';
import type { NotificationType } from 'vscode-messenger-common';

export type ExportScope = 'all' | 'byClassifier' | 'selection';

export interface ExportTemplateSummary {
    name: string;
    label: string;
    kind: 'builtin' | 'workspace';
    extension: string;
    description?: string;
    file?: string | null;
}

export interface RequestAvailableExportTemplatesAction extends RequestAction<AvailableExportTemplatesResponse> {
    kind: typeof RequestAvailableExportTemplatesAction.KIND;
    workspaceTemplateDirectory?: string | null;
}

export namespace RequestAvailableExportTemplatesAction {
    export const KIND = 'requestAvailableExportTemplates';

    export function is(object: unknown): object is RequestAvailableExportTemplatesAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(
        options: { requestId?: string; workspaceTemplateDirectory?: string | null } = {}
    ): RequestAvailableExportTemplatesAction {
        return {
            kind: KIND,
            requestId: options.requestId ?? '',
            workspaceTemplateDirectory: options.workspaceTemplateDirectory ?? null
        };
    }
}

export interface AvailableExportTemplatesResponse extends ResponseAction {
    kind: typeof AvailableExportTemplatesResponse.KIND;
    templates: ExportTemplateSummary[];
    workspaceTemplateDirectory?: string | null;
}

export namespace AvailableExportTemplatesResponse {
    export const KIND = 'availableExportTemplatesResponse';

    export function is(object: unknown): object is AvailableExportTemplatesResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<AvailableExportTemplatesResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): AvailableExportTemplatesResponse {
        return {
            kind: KIND,
            responseId: options?.responseId ?? '',
            templates: options?.templates ?? [],
            workspaceTemplateDirectory: options?.workspaceTemplateDirectory ?? null
        };
    }
}

export interface RequestExportInstancesAction extends RequestAction<ExportInstancesResponse> {
    kind: typeof RequestExportInstancesAction.KIND;
    action: {
        scope: ExportScope;
        classifierId?: string | null;
        classifierIds?: string[] | null;
        selection?: string[] | null;
        templateName: string; // e.g. 'json' or custom name
        customTemplateFile?: string | null; // absolute path if provided
    };
}

export namespace RequestExportInstancesAction {
    export const KIND = 'requestExportInstances';

    export function is(object: unknown): object is RequestExportInstancesAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(
        options: Partial<RequestExportInstancesAction> & { action: RequestExportInstancesAction['action'] }
    ): RequestExportInstancesAction {
        return {
            kind: KIND,
            requestId: options.requestId ?? '',
            action: options.action
        } as RequestExportInstancesAction;
    }
}

export interface ExportInstancesResponse extends ResponseAction {
    kind: typeof ExportInstancesResponse.KIND;
    success: boolean;
    message?: string;
    content?: string; // rendered output
}

export namespace ExportInstancesResponse {
    export const KIND = 'exportInstancesResponse';

    export function is(object: unknown): object is ExportInstancesResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<ExportInstancesResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): ExportInstancesResponse {
        return {
            kind: KIND,
            responseId: options?.responseId ?? '',
            success: options?.success ?? false,
            message: options?.message,
            content: options?.content
        } as ExportInstancesResponse;
    }
}

export interface RequestSaveExportedInstancesAction extends RequestAction<SaveExportedInstancesResponse> {
    kind: typeof RequestSaveExportedInstancesAction.KIND;
    content: string;
    suggestedFileName: string;
}

export namespace RequestSaveExportedInstancesAction {
    export const KIND = 'requestSaveExportedInstances';

    export function is(object: unknown): object is RequestSaveExportedInstancesAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestSaveExportedInstancesAction, 'kind' | 'requestId'>): RequestSaveExportedInstancesAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface SaveExportedInstancesResponse extends ResponseAction {
    kind: typeof SaveExportedInstancesResponse.KIND;
    success: boolean;
    message?: string;
    filePath?: string | null;
}

export namespace SaveExportedInstancesResponse {
    export const KIND = 'saveExportedInstancesResponse';

    export function is(object: unknown): object is SaveExportedInstancesResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<SaveExportedInstancesResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): SaveExportedInstancesResponse {
        return {
            kind: KIND,
            responseId: options?.responseId ?? '',
            success: options?.success ?? false,
            message: options?.message,
            filePath: options?.filePath ?? null
        };
    }
}

export namespace ExportInstancesNotification {
    export const OpenDialog: NotificationType<{ source: 'command' | 'view' }> = {
        method: 'instance-export/open-dialog'
    };
    export const SelectionChanged: NotificationType<{ selectedElementIds: string[] }> = {
        method: 'instance-export/selection-changed'
    };
}
