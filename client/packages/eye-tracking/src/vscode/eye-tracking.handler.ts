/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    EXPERIMENTAL_TYPES,
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type Disposable,
    type ExperimentalGLSPServerModelState
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import { EyeTrackingActionResponse, RequestEyeTrackingAction } from '../common/eye-tracking.action.js';

// Handle the action within the server and not the glsp client / server
@injectable()
export class EyeTrackingActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    private readonly toDispose = new DisposableCollection();
    private count = 0;

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestEyeTrackingAction>(RequestEyeTrackingAction.KIND, async message => {
                this.count += message.action.increase;
                console.log(`Eye Tracking from VS Code: ${this.count}`);
                return EyeTrackingActionResponse.create({
                    count: this.count
                });
            })
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
