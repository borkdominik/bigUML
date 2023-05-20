/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Args } from '@eclipse-glsp/protocol';
import { GLSPDiagramLanguage, TheiaDiagramServer } from '@eclipse-glsp/theia-integration';
import { BaseTheiaGLSPConnector } from '@eclipse-glsp/theia-integration/lib/browser/diagram/base-theia-glsp-connector';
import { injectable } from 'inversify';

import { UTDiagramLanguage } from '../../../common/language';

@injectable()
export class UTGLSPConnector extends BaseTheiaGLSPConnector {
    private _diagramType: string = UTDiagramLanguage.diagramType;
    private _contributionId: string = UTDiagramLanguage.contributionId;

    doConfigure(diagramLanguage: GLSPDiagramLanguage): void {
        this._contributionId = diagramLanguage.contributionId;
        this._diagramType = diagramLanguage.diagramType;
        this.initialize();
    }

    get diagramType(): string {
        if (!this._diagramType) {
            throw new Error('No diagramType has been set for this UTGLSPConnector');
        }
        return this._diagramType;
    }

    get contributionId(): string {
        if (!this._contributionId) {
            throw new Error('No contributionId has been set for this UTGLSPConnector');
        }
        return this._contributionId;
    }

    protected override initialize(): void {
        if (this._diagramType && this._contributionId) {
            super.initialize();
        }
    }

    override disposeClientSessionArgs(diagramServer: TheiaDiagramServer): Args | undefined {
        return {
            ['sourceUri']: diagramServer.sourceUri
        };
    }
}
