/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    type Action,
    changeCodiconClass,
    createIcon,
    EnableToolPaletteAction,
    FocusDomAction,
    type GModelRoot,
    type ICommand,
    type KeyCode,
    MarqueeMouseTool,
    matchesKeystroke,
    MouseDeleteTool,
    type PaletteItem,
    RequestContextActions,
    RequestMarkersAction,
    SetContextActions,
    SetUIExtensionVisibilityAction,
    ToolPalette
} from '@eclipse-glsp/client';
import { KeyboardToolPalette } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-tool-palette/keyboard-tool-palette.js';
import { injectable } from 'inversify';
import { SDShiftMouseTool } from '../../uml/diagram/sequence/features/tools/shift-mouse-tool.js';

const CLICKED_CSS_CLASS = 'clicked';
const CHEVRON_DOWN_ICON_ID = 'chevron-right';
const PALETTE_ICON_ID = 'symbol-color';
const AVAILABLE_KEYS: KeyCode[] = [
    'KeyA',
    'KeyB',
    'KeyC',
    'KeyD',
    'KeyE',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyI',
    'KeyJ',
    'KeyK',
    'KeyL',
    'KeyM',
    'KeyN',
    'KeyO',
    'KeyP',
    'KeyQ',
    'KeyR',
    'KeyS',
    'KeyT',
    'KeyU',
    'KeyV',
    'KeyX',
    'KeyY',
    'KeyZ'
];

const SEARCH_ICON_ID = 'search';
const SELECTION_TOOL_KEY: KeyCode[] = ['Digit1', 'Numpad1'];
const DELETION_TOOL_KEY: KeyCode[] = ['Digit2', 'Numpad2'];
const MARQUEE_TOOL_KEY: KeyCode[] = ['Digit3', 'Numpad3'];
const VALIDATION_TOOL_KEY: KeyCode[] = ['Digit4', 'Numpad4'];
const SEARCH_TOOL_KEY: KeyCode[] = ['Digit5', 'Numpad5'];

@injectable()
export class UMLToolPalette extends KeyboardToolPalette {
    declare defaultToolsButton: HTMLElement;

    protected override onBeforeShow(_containerElement: HTMLElement, root: Readonly<GModelRoot>): void {
        // Removed max height
        this.modelRootId = root.id;
    }

    override handle(action: Action): ICommand | Action | void {
        if (EnableToolPaletteAction.is(action)) {
            const requestAction = RequestContextActions.create({
                contextId: ToolPalette.ID,
                editorContext: {
                    selectedElementIds: []
                }
            });
            this.actionDispatcher.requestUntil(requestAction).then(response => {
                if (SetContextActions.is(response)) {
                    this.paletteItems = response.actions.map(e => e as PaletteItem);
                    this.actionDispatcher.dispatchAll([
                        SetUIExtensionVisibilityAction.create({ extensionId: ToolPalette.ID, visible: !this.editorContext.isReadonly })
                    ]);
                }
            });
        } else if (FocusDomAction.is(action) && action.id === ToolPalette.ID) {
            this.containerElement.focus();
        } else {
            super.handle(action);
        }
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
        const headerTools = super.createHeaderTools();

        // TODO: Sequence Specific
        const createShiftButton = this.createShiftButton();
        headerTools.appendChild(createShiftButton);

        return headerTools;
    }

    protected override createDefaultToolButton(): HTMLElement {
        const container = document.createElement('div');
        const icon = createIcon('inspect');
        icon.id = 'btn_default_tools';
        icon.title = 'Enable selection tool';

        container.onclick = this.onClickStaticToolButton(container);
        container.appendChild(this.createKeyboardShotcut(SELECTION_TOOL_KEY[0]));
        container.appendChild(icon);

        return container;
    }

    protected override createMouseDeleteToolButton(): HTMLElement {
        const container = document.createElement('div');
        const icon = createIcon('chrome-close');

        container.onclick = this.onClickStaticToolButton(container, MouseDeleteTool.ID);
        container.appendChild(this.createKeyboardShotcut(DELETION_TOOL_KEY[0]));
        container.appendChild(icon);

        return container;
    }

    protected override createMarqueeToolButton(): HTMLElement {
        const container = document.createElement('div');
        const icon = createIcon('screen-full');

        container.onclick = this.onClickStaticToolButton(container, MarqueeMouseTool.ID);
        container.appendChild(this.createKeyboardShotcut(MARQUEE_TOOL_KEY[0]));
        container.appendChild(icon);

        return container;
    }

    protected override createValidateButton(): HTMLElement {
        const container = document.createElement('div');
        const icon = createIcon('pass');
        icon.title = 'Validate model';

        container.onclick = _event => {
            const modelIds: string[] = [this.modelRootId];
            this.actionDispatcher.dispatch(RequestMarkersAction.create(modelIds));
        };
        container.appendChild(this.createKeyboardShotcut(VALIDATION_TOOL_KEY[0]));
        container.appendChild(icon);

        return container;
    }

    protected override createSearchButton(): HTMLElement {
        const container = document.createElement('div');
        const icon = createIcon(SEARCH_ICON_ID);
        icon.classList.add('search-icon');
        icon.title = 'Filter palette entries';
        container.onclick = _ev => {
            const searchField = document.getElementById(this.containerElement.id + '_search_field');
            if (searchField) {
                if (searchField.style.display === 'none') {
                    searchField.style.display = '';
                    searchField.focus();
                } else {
                    searchField.style.display = 'none';
                }
            }
        };
        container.appendChild(this.createKeyboardShotcut(SEARCH_TOOL_KEY[0]));
        container.appendChild(icon);

        return container;
    }

    protected createShiftButton(): HTMLElement {
        const verticalShiftToolButton = createIcon('split-vertical');
        verticalShiftToolButton.title = 'Enable vertical shift tool [Alt + Click]';
        verticalShiftToolButton.onclick = this.onClickStaticToolButton(verticalShiftToolButton, SDShiftMouseTool.ID);
        return verticalShiftToolButton;
    }

    protected override createKeyboardToolButton(item: PaletteItem, tabIndex: number, buttonIndex: number): HTMLElement {
        const button = document.createElement('div');
        // add keyboard index
        if (buttonIndex < AVAILABLE_KEYS.length) {
            button.appendChild(this.createKeyboardShotcut(AVAILABLE_KEYS[buttonIndex]));
        }
        button.tabIndex = tabIndex;
        button.classList.add('tool-button');
        if (item.icon) {
            button.appendChild(this.createIcon(item.icon));
        }
        button.insertAdjacentText('beforeend', item.label);
        button.onclick = this.onClickCreateToolButton(button, item);

        button.onkeydown = ev => {
            this.clickToolOnEnter(ev, button, item);
            this.clearToolOnEscape(ev);

            if (matchesKeystroke(ev, 'ArrowDown')) {
                if (buttonIndex + 1 > this.keyboardIndexButtonMapping.size - 1) {
                    this.selectItemViaArrowKey(this.keyboardIndexButtonMapping.get(0));
                } else {
                    this.selectItemViaArrowKey(this.keyboardIndexButtonMapping.get(buttonIndex + 1));
                }
            } else if (matchesKeystroke(ev, 'ArrowUp')) {
                if (buttonIndex - 1 < 0) {
                    this.selectItemViaArrowKey(this.keyboardIndexButtonMapping.get(this.keyboardIndexButtonMapping.size - 1));
                } else {
                    this.selectItemViaArrowKey(this.keyboardIndexButtonMapping.get(buttonIndex - 1));
                }
            }
        };

        return button;
    }

    protected createIcon(cssClass: string): HTMLDivElement {
        const icon = document.createElement('div');
        icon.classList.add(...['uml-icon', cssClass]);
        return icon;
    }

    override async preRequestModel(): Promise<void> {
        // in this phase, the notation is still not loaded
        return;
    }

    override async postRequestModel(): Promise<void> {
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
