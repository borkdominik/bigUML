/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RefreshPropertyPaletteAction, RequestPropertyPaletteAction, type SetPropertyPaletteAction } from '@borkdominik-biguml/uml-protocol';
import { type Action, type GModelRoot, type IActionHandler, type ICommand, type IGModelRootListener, SelectAction, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { type UMLActionDispatcher } from '../../base/action-dispatcher.js';

@injectable()
export class PropertyPaletteHandler implements IActionHandler, IGModelRootListener {
    @inject(TYPES.IActionDispatcherProvider) protected actionDispatcher: () => Promise<UMLActionDispatcher>;
    protected activeElementId?: string;

    handle(action: Action): ICommand | Action | void {
        if (SelectAction.is(action) && action.selectedElementsIDs.length > 0) {
            this.request(action.selectedElementsIDs.filter(id => id !== undefined && id !== null).at(-1));
        } else if (RefreshPropertyPaletteAction.is(action)) {
            this.request(action.elementId ?? this.activeElementId);
        }
    }

    modelRootChanged(_root: Readonly<GModelRoot>): void {
        this.request(this.activeElementId);
    }

    protected async request(elementId?: string): Promise<SetPropertyPaletteAction> {
        const actionDispatcher = await this.actionDispatcher();
        await actionDispatcher.onceModelInitialized();
        this.activeElementId = elementId;
        return actionDispatcher.request<SetPropertyPaletteAction>(RequestPropertyPaletteAction.create({ elementId }));
    }
}
