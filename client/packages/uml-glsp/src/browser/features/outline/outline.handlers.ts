/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestOutlineAction } from '@borkdominik-biguml/uml-protocol';
import { Action, GModelRoot, IActionHandler, IDiagramStartup, IGModelRootListener, MaybePromise, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { UMLActionDispatcher } from '../../base/action-dispatcher.js';

@injectable()
export class OutlineService implements IActionHandler, IDiagramStartup, IGModelRootListener {
    @inject(TYPES.IActionDispatcherProvider) protected actionDispatcher: () => Promise<UMLActionDispatcher>;

    handle(_action: Action): void | Action {
        // nothing to do
        // the code will be handled outside of GLSP
    }

    modelRootChanged(_root: Readonly<GModelRoot>): void {
        this.request();
    }

    postModelInitialization(): MaybePromise<void> {
        return this.request();
    }

    protected async request(): Promise<void> {
        const actionDispatcher = await this.actionDispatcher();
        await actionDispatcher.onceModelInitialized();
        await actionDispatcher.dispatch(RequestOutlineAction.create());
    }
}
