/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Args, MaybePromise } from '@eclipse-glsp/client';
import { BaseGLSPClientContribution } from '@eclipse-glsp/theia-integration/lib/browser';
import { injectable } from 'inversify';

import { UTDiagramLanguage } from '../../../common/language';

export interface UTInitializeOptions {
    timestamp: Date;
    modelServerURL: string;
}

@injectable()
export class UTClientContribution extends BaseGLSPClientContribution {
    readonly id = UTDiagramLanguage.contributionId;
    readonly fileExtensions = UTDiagramLanguage.fileExtensions;

    protected override createInitializeOptions(): MaybePromise<Args | undefined> {
        return {
            ['timestamp']: new Date().toString(),
            ['modelServerURL']: 'http://localhost:8081/api/v2/'
        };
    }
}
