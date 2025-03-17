/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';

export interface AudioRecordingCompleteAction extends Action {
    kind: typeof AudioRecordingCompleteAction.KIND;
    filePath: string;
    fileData: Uint8Array;
    recordingTimestamp: string;
}

export namespace AudioRecordingCompleteAction {
    export const KIND = 'audioRecordingComplete';

    export function is(object: any): object is AudioRecordingCompleteAction {
        return Action.hasKind(object, KIND);
    }

    export function create(filePath: string, fileData: Uint8Array, recordingTimestamp: string): AudioRecordingCompleteAction {
        return {
            kind: KIND,
            filePath,
            fileData,
            recordingTimestamp
        };
    }
}
