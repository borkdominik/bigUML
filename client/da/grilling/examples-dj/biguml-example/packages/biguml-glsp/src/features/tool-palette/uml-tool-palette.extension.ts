/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    changeCodiconClass,
    createIcon,
    GModelRoot,
    PaletteItem,
    RequestContextActions,
    SetContextActions,
    ToolPalette
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { SDShiftMouseTool } from '../../uml/diagram/sequence/features/tools/shift-mouse-tool';

const CLICKED_CSS_CLASS = 'clicked';
const CHEVRON_DOWN_ICON_ID = 'chevron-right';
const PALETTE_ICON_ID = 'symbol-color';

@injectable()
export class UmlToolPalette extends ToolPalette {
    protected override defaultToolsButton: HTMLElement;

    protected override onBeforeShow(_containerElement: HTMLElement, root: Readonly<GModelRoot>): void {
        // Removed max height
        this.modelRootId = root.id;
    }

    override changeActiveButton(button?: HTMLElement): void {
        if (this.lastActiveButton) {
            this.lastActiveButton.classList.remove(CLICKED_CSS_CLASS);
        }
        if (button) {
            button.classList.add(CLICKED_CSS_CLASS);
            this.lastActiveButton = button;
        } else {
            this.defaultToolsButton?.classList.add(CLICKED_CSS_CLASS);
            this.lastActiveButton = this.defaultToolsButton;
        }
    }

    protected override addMinimizePaletteButton(): void {
        // Removed max height
        const baseDiv = document.getElementById(this.options.baseDiv);
        const minPaletteDiv = document.createElement('div');
        minPaletteDiv.classList.add('minimize-palette-button');
        this.containerElement.classList.add('collapsible-palette');
        if (baseDiv) {
            const insertedDiv = baseDiv.insertBefore(minPaletteDiv, baseDiv.firstChild);
            const minimizeIcon = createIcon(CHEVRON_DOWN_ICON_ID);
            this.updateMinimizePaletteButtonTooltip(minPaletteDiv);
            minimizeIcon.onclick = _event => {
                if (this.isPaletteMaximized()) {
                    this.containerElement.style.maxHeight = '0px';
                } else {
                    this.containerElement.style.maxHeight = '';
                }
                this.updateMinimizePaletteButtonTooltip(minPaletteDiv);
                changeCodiconClass(minimizeIcon, PALETTE_ICON_ID);
                changeCodiconClass(minimizeIcon, CHEVRON_DOWN_ICON_ID);
            };
            insertedDiv.appendChild(minimizeIcon);
        }
    }

    protected override createHeaderTools(): HTMLElement {
        // as super
        const headerTools = document.createElement('div');
        headerTools.classList.add('header-tools');

        this.defaultToolsButton = this.createDefaultToolButton();
        headerTools.appendChild(this.defaultToolsButton);

        const deleteToolButton = this.createMouseDeleteToolButton();
        headerTools.appendChild(deleteToolButton);

        const marqueeToolButton = this.createMarqueeToolButton();
        headerTools.appendChild(marqueeToolButton);

        const validateActionButton = this.createValidateButton();
        headerTools.appendChild(validateActionButton);

        const searchIcon = this.createSearchButton();
        headerTools.appendChild(searchIcon);

        // TODO: Sequence Specific
        const createShiftButton = this.createShiftButton();
        headerTools.appendChild(createShiftButton);

        return headerTools;
    }

    protected createShiftButton(): HTMLElement {
        const verticalShiftToolButton = createIcon('split-vertical');
        verticalShiftToolButton.title = 'Enable vertical shift tool [Alt + Click]';
        verticalShiftToolButton.onclick = this.onClickStaticToolButton(verticalShiftToolButton, SDShiftMouseTool.ID);
        return verticalShiftToolButton;
    }

    protected override createToolButton(item: PaletteItem, index: number): HTMLElement {
        const button = document.createElement('div');
        button.appendChild(this.createUmlIcon(item.icon || ''));
        button.tabIndex = index;
        button.classList.add('tool-button');
        button.classList.add('uml-tool-button');
        button.insertAdjacentText('beforeend', item.label);
        button.onclick = super.onClickCreateToolButton(button, item);
        button.onkeydown = ev => this.clearToolOnEscape(ev);
        return button;
    }

    protected createUmlIcon(cssClass: string): HTMLDivElement {
        const icon = document.createElement('div');
        icon.classList.add(...['umlimg', cssClass]);
        return icon;
    }

    override async preRequestModel(): Promise<void> {
        // in this phase, the notation is still not loaded
        return;
    }

    async postRequestModel(): Promise<void> {
        const requestAction = RequestContextActions.create({
            contextId: ToolPalette.ID,
            editorContext: {
                selectedElementIds: []
            }
        });
        const response = await this.actionDispatcher.request<SetContextActions>(requestAction);
        this.paletteItems = response.actions.map(e => e as PaletteItem);
        if (!this.editorContext.isReadonly) {
            this.show(this.editorContext.modelRoot);
        }
    }
}
