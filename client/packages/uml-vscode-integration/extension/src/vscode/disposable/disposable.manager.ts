/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import type * as vscode from 'vscode';
import { TYPES } from '../../di.types.js';

export interface Disposable {
    dispose(): any;
}

@injectable()
export class DisposableManager {
    constructor(
        @inject(TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @multiInject(TYPES.Disposable) protected readonly disposables: Disposable[]
    ) {}

    @postConstruct()
    initialize(): void {
        this.disposables.forEach(d => this.context.subscriptions.push(d));
    }
}
