/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { changeCodiconClass, compare, createIcon, createToolGroup, GModelRoot, PaletteItem, ToolPalette } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { SDShiftMouseTool } from '../../uml/diagram/sequence/features/tools/shift-mouse-tool';

const CLICKED_CSS_CLASS = 'clicked';
const CHEVRON_DOWN_ICON_ID = 'chevron-right';
const PALETTE_ICON_ID = 'symbol-color';

@injectable()
export class UmlToolPalette extends ToolPalette {
    protected override defaultToolsButton: HTMLElement;

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

    protected override onBeforeShow(_containerElement: HTMLElement, root: Readonly<GModelRoot>): void {
        this.modelRootId = root.id;
    }

    protected override addMinimizePaletteButton(): void {
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

    protected override createHeader(): void {
        this.addMinimizePaletteButton();
        const headerCompartment = document.createElement('div');
        headerCompartment.classList.add('palette-header');
        headerCompartment.append(this.createHeaderTitle());
        headerCompartment.appendChild(this.overridecreateHeaderTools());
        headerCompartment.appendChild((this.searchField = this.createHeaderSearchField()));
        this.containerElement.appendChild(headerCompartment);
    }

    // TODO: This is private in base class
    protected overridecreateHeaderTools(): HTMLElement {
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

        // addition
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

    protected override createBody(): void {
        const bodyDiv = document.createElement('div');
        bodyDiv.classList.add('palette-body');
        let tabIndex = 0;
        this.paletteItems.sort(compare).forEach(item => {
            if (item.children) {
                const group = createToolGroup(item);
                item.children
                    .sort(compare)
                    .forEach(child => group.appendChild(this.createUmlToolButton(child, tabIndex++, child.icon || '')));
                bodyDiv.appendChild(group);
            } else {
                bodyDiv.appendChild(this.createUmlToolButton(item, tabIndex++, item.icon || 'umlclass'));
            }
        });
        if (this.paletteItems.length === 0) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.innerText = 'No results found.';
            noResultsDiv.classList.add('tool-button');
            bodyDiv.appendChild(noResultsDiv);
        }
        // Remove existing body to refresh filtered entries
        if (this.bodyDiv) {
            this.containerElement.removeChild(this.bodyDiv);
        }
        this.containerElement.appendChild(bodyDiv);
        this.bodyDiv = bodyDiv;
    }

    protected createUmlToolButton(item: PaletteItem, index: number, icon: string): HTMLElement {
        const button = document.createElement('div');
        button.appendChild(this.createUmlIcon(icon));
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
}
