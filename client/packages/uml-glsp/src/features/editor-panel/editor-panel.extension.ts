/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    AbstractUIExtension,
    Action,
    ActionDispatcher,
    codiconCSSClasses,
    IActionHandler,
    ICommand,
    SetUIExtensionVisibilityAction,
    TYPES
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject } from 'inversify';

import { EDITOR_PANEL_TYPES } from './di.types';
import { EnableEditorPanelAction, RequestEditorPanelAction, SetEditorPanelAction } from './editor-panel.actions';
import { EditorPanelChild } from './editor-panel.interfaces';

@injectable()
export class EditorPanel extends AbstractUIExtension implements IActionHandler {
    static readonly ID = 'editor-panel';

    @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: ActionDispatcher;
    @multiInject(EDITOR_PANEL_TYPES.Child) protected readonly children: EditorPanelChild[];

    protected editorAction: SetEditorPanelAction;

    protected header: HTMLElement;
    protected body: HTMLElement;
    protected collapseButton: HTMLButtonElement;

    get isCollapsed(): boolean {
        return this.body.style.display === 'none';
    }

    id(): string {
        return EditorPanel.ID;
    }

    containerClass(): string {
        return EditorPanel.ID;
    }

    handle(action: Action): ICommand | Action | void {
        if (action.kind === EnableEditorPanelAction.KIND) {
            this.request().then(response => {
                this.editorAction = response;

                this.actionDispatcher.dispatch(
                    SetUIExtensionVisibilityAction.create({
                        extensionId: EditorPanel.ID,
                        visible: true
                    })
                );
            });
        }
    }

    toggle(): void {
        if (this.isCollapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    collapse(): void {
        if (!this.isCollapsed) {
            this.body.style.display = 'none';
            this.collapseButton.firstElementChild?.classList.remove('codicon-chevron-down');
            this.collapseButton.firstElementChild?.classList.add('codicon-chevron-up');
        }
    }

    expand(): void {
        if (this.isCollapsed) {
            this.body.style.display = 'flex';
            this.collapseButton.firstElementChild?.classList.add('codicon-chevron-down');
            this.collapseButton.firstElementChild?.classList.remove('codicon-chevron-up');
        }
    }

    protected initializeContents(containerElement: HTMLElement): void {
        containerElement.tabIndex = 0;

        this.initializeHeader();
        this.initializeBody();

        // this.collapse();
    }

    protected initializeHeader(): void {
        const header = document.createElement('div');
        header.classList.add(`${EditorPanel.ID}-header`);
        header.addEventListener('click', event => {
            event.stopPropagation();
            this.toggle();
        });

        this.children.forEach(child => {
            const tab = document.createElement('div');
            tab.classList.add(`${EditorPanel.ID}-tab-header`, 'active');
            tab.innerText = child.tabLabel;
            tab.addEventListener('click', event => {
                event.stopPropagation();
            });

            header.appendChild(tab);
        });

        const collapse = document.createElement('button');
        collapse.classList.add(`${EditorPanel.ID}-collapse`);
        collapse.appendChild(createIcon('chevron-down'));
        collapse.addEventListener('click', event => {
            event.stopPropagation();
            this.toggle();
        });
        header.appendChild(collapse);

        this.header = header;
        this.collapseButton = collapse;
        this.containerElement.appendChild(header);
    }

    protected initializeBody(): void {
        const body = document.createElement('div');
        body.classList.add(`${EditorPanel.ID}-body`);

        this.body = body;
        this.containerElement.appendChild(body);

        if (this.children.length > 0) {
            this.initializeChild(this.children[0]);
        }
    }

    protected async initializeChild(child: EditorPanelChild): Promise<void> {
        this.body.innerHTML = '';

        const content = document.createElement('div');
        content.classList.add(`${EditorPanel.ID}-content`, child.class);

        await child.prepare?.();
        child.initializeContents(content);

        this.body.appendChild(content);
    }

    protected async request(): Promise<SetEditorPanelAction> {
        return this.actionDispatcher.request<SetEditorPanelAction>(new RequestEditorPanelAction());
    }
}

function createIcon(codiconId: string): HTMLElement {
    const icon = document.createElement('i');
    icon.classList.add(...codiconCSSClasses(codiconId));
    return icon;
}
