/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RefreshPropertyPaletteAction, RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import {
    Action,
    ActionDispatcher,
    EditorContextService,
    IActionHandler,
    ICommand,
    SelectAction,
    SetDirtyStateAction,
    SModelRoot,
    SModelRootListener,
    TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

/**
 * Workaround until the webview (property palette) can handle the actions directly
 */
@injectable()
export class PropertyPaletteHandler implements IActionHandler, SModelRootListener {
    @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: ActionDispatcher;
    @inject(EditorContextService) protected readonly editorContext: EditorContextService;
    protected activeElementId?: string;

    handle(action: Action): ICommand | Action | void {
        if (SelectAction.is(action) && action.selectedElementsIDs.length > 0) {
            this.request(action.selectedElementsIDs[0]);
        } else if (SetDirtyStateAction.is(action)) {
            this.request(this.activeElementId);
        } else if (RefreshPropertyPaletteAction.is(action)) {
            this.request(action.elementId ?? this.activeElementId);
        }
    }

    modelRootChanged(root: Readonly<SModelRoot>): void {
        this.request();
    }

    protected async request(elementId?: string): Promise<SetPropertyPaletteAction> {
        this.activeElementId = elementId;
        return this.actionDispatcher.request<SetPropertyPaletteAction>(RequestPropertyPaletteAction.create({ elementId }));
    }
}
