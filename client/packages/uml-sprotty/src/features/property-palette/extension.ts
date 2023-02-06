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
    Action,
    ActionDispatcher,
    EditorContextService,
    IActionHandler,
    ICommand,
    isSelectAction,
    SelectAction,
    SModelRoot,
    SModelRootListener,
    TYPES
} from "@eclipse-glsp/client";
import { inject, injectable, postConstruct } from "inversify";

import { EditorPanelChild } from "../editor-panel/interfaces";
import { RequestPropertyPaletteAction, SetPropertyPaletteAction, UpdateElementPropertyAction } from "./actions";
import { createBoolProperty, ElementBoolPropertyItem } from "./bool";
import { createChoiceProperty, ElementChoicePropertyItem } from "./choice";
import {
    CreatedElementProperty,
    ElementPropertyItem,
    ElementPropertyUI,
    PropertyPalette as PropertyPaletteModel
} from "./model";
import { createTextProperty, ElementTextPropertyItem } from "./text";

@injectable()
export class PropertyPalette implements IActionHandler, SModelRootListener, EditorPanelChild {
    static readonly ID = "property-palette";

    @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: ActionDispatcher;
    @inject(EditorContextService) protected readonly editorContext: EditorContextService;

    protected paletteAction?: SetPropertyPaletteAction;
    protected selectAction?: SelectAction;
    protected uiElements: ElementPropertyUI[] = [];

    protected containerElement: HTMLElement;
    protected header: HTMLElement;
    protected content: HTMLElement;

    get selectedItems(): string[] {
        return this.selectAction?.selectedElementsIDs ?? [];
    }

    get palette(): PropertyPaletteModel | undefined {
        return this.paletteAction?.palette;
    }

    get id(): string {
        return PropertyPalette.ID;
    }

    get tabLabel(): string {
        return "Properties";
    }

    get class(): string {
        return PropertyPalette.ID;
    }

    @postConstruct()
    postConstruct(): void {
        this.editorContext.register(this);
    }

    handle(action: Action): ICommand | Action | void {
        if (isSelectAction(action) && action.selectedElementsIDs.length > 0) {
            this.selectAction = action;
            this.refresh();
        }
    }

    editModeChanged(_oldValue: string, _newValue: string): void {
        if (this.editorContext.isReadonly) {
            this.disable();
        } else {
            this.enable();
        }
    }

    modelRootChanged(root: Readonly<SModelRoot>): void {
        this.refresh();
        this.enable();
    }

    async prepare(): Promise<void> {
        await this.refresh();
    }

    initializeContents(containerElement: HTMLElement): void {
        this.containerElement = containerElement;

        this.initializeHeader();
        this.initializeBody();

        this.refreshUi(this.palette);
    }

    protected initializeHeader(): void {
        const header = document.createElement("div");
        header.classList.add(`${PropertyPalette.ID}-header`);

        this.header = header;
        this.containerElement.appendChild(header);
    }

    protected initializeBody(): void {
        const content = document.createElement("div");
        content.classList.add(`${PropertyPalette.ID}-content`);

        this.content = content;
        this.containerElement.appendChild(content);
    }

    protected refreshUi(palette?: PropertyPaletteModel): void {
        if (this.containerElement === undefined) {
            return;
        }

        this.header.innerHTML = "";
        this.content.innerHTML = "";

        if (palette === undefined) {
            setTextPlaceholder(this.header, "Properties not available.");
        } else {
            this.refreshHeader(palette);
            this.refreshContent(palette.items);
        }
    }

    protected refreshHeader(palette: PropertyPaletteModel): void {
        const label = palette.label;
        if (label !== undefined) {
            this.header.textContent = label;
        } else {
            setTextPlaceholder(this.header, "No label provided.");
        }
    }

    protected refreshContent(items: ElementPropertyItem[]): void {
        this.content.innerHTML = "";
        this.uiElements = [];

        if (items !== undefined && items.length > 0) {
            for (const propertyItem of items) {
                let created: CreatedElementProperty | undefined = undefined;

                if (ElementTextPropertyItem.is(propertyItem)) {
                    created = createTextProperty(propertyItem, {
                        onBlur: (item, input) => {
                            this.update(item.elementId, item.propertyId, input.value);
                        },
                        onEnter: (item, input) => {
                            this.update(item.elementId, item.propertyId, input.value);
                        }
                    });
                } else if (ElementBoolPropertyItem.is(propertyItem)) {
                    created = createBoolProperty(propertyItem, {
                        onChange: (item, input) => {
                            this.update(item.elementId, item.propertyId, input.checked + "");
                        }
                    });
                } else if (ElementChoicePropertyItem.is(propertyItem)) {
                    created = createChoiceProperty(propertyItem, {
                        onChange: (item, input) => {
                            this.update(item.elementId, item.propertyId, input.value);
                        }
                    });
                }

                if (created !== undefined) {
                    this.content.appendChild(created.element);
                    this.uiElements.push(created.ui);
                }
            }
        } else {
            setTextPlaceholder(this.content, "No properties provided.");
        }
    }

    protected async refresh(): Promise<SetPropertyPaletteAction> {
        const id = this.selectedItems[0];

        return this.request(id).then(response => {
            this.paletteAction = response;

            this.refreshUi(this.palette);

            return response;
        });
    }

    protected async request(elementId?: string): Promise<SetPropertyPaletteAction> {
        return this.actionDispatcher.request<SetPropertyPaletteAction>(new RequestPropertyPaletteAction(elementId));
    }

    protected async update(elementId: string, propertyId: string, value: string): Promise<void> {
        this.disable();
        return this.actionDispatcher.dispatch(new UpdateElementPropertyAction(elementId, propertyId, value));
    }

    protected disable(): void {
        this.uiElements.forEach(element => element.disable());
    }

    protected enable(): void {
        this.uiElements.forEach(element => element.enable());
    }
}

function setTextPlaceholder(container: HTMLElement, text: string): void {
    const div = document.createElement("div");

    div.textContent = text;

    container.innerHTML = "";
    container.appendChild(div);
}
