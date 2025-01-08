/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, GModelRoot, IActionHandler, MaybePromise, ICommand, IGModelRootListener, IDiagramStartup, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { UMLActionDispatcher } from '../../base/action-dispatcher';

@injectable()
export class TextInputPaletteHandler implements IActionHandler, IDiagramStartup, IGModelRootListener {
    @inject(TYPES.IActionDispatcherProvider) protected actionDispatcher: () => Promise<UMLActionDispatcher>;
    protected activeElementId?: string;

    handle(action: Action): ICommand | Action | void {
        
    }

    modelRootChanged(root: Readonly<GModelRoot>): void {
        this.request(this.activeElementId); // TODO when active element
    }

    postModelInitialization(): MaybePromise<void> {
        return this.request();
    }

    protected async request(elementId?: string): Promise<void> {
        const actionDispatcher = await this.actionDispatcher();
        await actionDispatcher.onceModelInitialized();
        this.activeElementId = elementId;
        // return actionDispatcher.request<SetPropertyPaletteAction>(RequestPropertyPaletteAction.create({ elementId }));
    }
}
