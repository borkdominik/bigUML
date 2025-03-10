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
import { TYPES } from '../../vscode-common.types.js';

/**
 * A disposable interface that can be used to manage disposables in a consistent way.
 * Use {@link TYPES.Disposable} to register your disposable.
 */
export interface Disposable {
    dispose(): any;
}

/**
 * A manager for disposables that registers them to the extension context.
 * Use {@link TYPES.Disposable} to register your disposable.
 */
@injectable()
export class DisposableManager {
    constructor(
        @inject(TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @multiInject(TYPES.Disposable) protected readonly disposables: Disposable[]
    ) {}

    @postConstruct()
    initialize(): void {
        this.disposables.forEach(disposable => this.context.subscriptions.push(disposable));
    }
}
