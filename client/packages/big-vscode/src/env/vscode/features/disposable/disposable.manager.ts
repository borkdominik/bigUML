/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import type { Disposable } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, multiInject } from 'inversify';
import type * as vscode from 'vscode';
import { TYPES } from '../../vscode-common.types.js';
import type { OnActivate, OnDispose } from '../container/bindings.js';

@injectable()
export class DisposableManager implements OnActivate {
    constructor(
        @inject(TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @multiInject(TYPES.OnDispose) protected readonly disposables: OnDispose[]
    ) {}

    onActivate(): void {
        this.disposables.forEach(disposable => {
            if (disposable.dispose) {
                this.context.subscriptions.push(disposable as Disposable);
            }
        });
    }
}
