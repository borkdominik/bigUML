/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

// timeline-import-export.messages.ts

export interface TimelineImportExportPayload {
    action: 'import' | 'export';
}

export const TimelineImportExportNotification = {
    method: 'timeline/importExport'
};



