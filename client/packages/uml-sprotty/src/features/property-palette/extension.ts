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
    EditorContextService,
    IActionHandler,
    ICommand,
    isSelectAction,
    SelectAction,
    SetUIExtensionVisibilityAction,
    SModelRoot,
    SModelRootListener,
    TYPES
} from "@eclipse-glsp/client";
import { inject, injectable, postConstruct } from "inversify";

import {
    EnablePropertyPaletteAction,
    RequestPropertyPaletteAction,
    SetPropertyPaletteAction,
    UpdateElementPropertyAction
} from "./actions";
import { CreatedElementProperty, ElementPropertyItem, ElementPropertyUI } from "./model";
import { createTextProperty, ElementTextPropertyItem } from "./text";

@injectable()
export class PropertyPalette extends AbstractUIExtension implements IActionHandler, SModelRootListener {
    static readonly ID = "property-palette";

    @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: ActionDispatcher;
    @inject(EditorContextService) protected readonly editorContext: EditorContextService;

    protected propertyItems: ElementPropertyItem[];
    protected selectAction?: SelectAction;
    protected uiElements: ElementPropertyUI[] = [];

    protected header: HTMLElement;
    protected body: HTMLElement;
    protected collapseButton: HTMLButtonElement;

    get isCollapsed(): boolean {
        return this.body.style.display === "none";
    }

    get selectedItems(): string[] {
        return this.selectAction?.selectedElementsIDs ?? [];
    }

    id(): string {
        return PropertyPalette.ID;
    }

    containerClass(): string {
        return PropertyPalette.ID;
    }

    override initialize(): boolean {
        if (!this.propertyItems) {
            return false;
        }
        return super.initialize();
    }

    @postConstruct()
    postConstruct(): void {
        this.editorContext.register(this);
    }

    handle(action: Action): ICommand | Action | void {
        console.log("Handle action: ", action);

        if (action.kind === EnablePropertyPaletteAction.KIND) {
            this.refresh().then(() => {
                this.actionDispatcher.dispatch(
                    new SetUIExtensionVisibilityAction(PropertyPalette.ID, !this.editorContext.isReadonly)
                );
            });
        } else if (isSelectAction(action)) {
            this.selectAction = action;
            this.refresh();
        }
    }

    editModeChanged(_oldValue: string, _newValue: string): void {
        this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(PropertyPalette.ID, !this.editorContext.isReadonly));
    }

    modelRootChanged(root: Readonly<SModelRoot>): void {
        this.refresh();
        this.enable();
    }

    public toggle(): void {
        if (this.isCollapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    public collapse(): void {
        if (!this.isCollapsed) {
            this.body.style.display = "none";
            this.collapseButton.firstElementChild?.classList.remove("codicon-chevron-down");
            this.collapseButton.firstElementChild?.classList.add("codicon-chevron-up");
        }
    }

    public expand(): void {
        if (this.isCollapsed) {
            this.body.style.display = "flex";
            this.collapseButton.firstElementChild?.classList.add("codicon-chevron-down");
            this.collapseButton.firstElementChild?.classList.remove("codicon-chevron-up");
        }
    }

    protected initializeContents(containerElement: HTMLElement): void {
        containerElement.tabIndex = 0;

        this.initializeHeader();
        this.initializeBody();

        // this.collapse();

        this.refreshItems(this.propertyItems);
    }

    protected initializeHeader(): void {
        const div = document.createElement("div");
        div.classList.add("property-palette-header");

        const umlTab = document.createElement("div");
        umlTab.classList.add("property-palette-tab-header");
        umlTab.innerText = "UML";
        div.appendChild(umlTab);

        const collapse = document.createElement("button");
        collapse.classList.add("property-palette-collapse");
        collapse.appendChild(createIcon("chevron-down"));
        collapse.addEventListener("click", () => this.toggle());
        div.appendChild(collapse);

        this.header = div;
        this.collapseButton = collapse;
        this.containerElement.appendChild(div);
    }

    protected initializeBody(): void {
        const div = document.createElement("div");
        div.classList.add("property-palette-body");
        div.innerText = "Body";

        this.body = div;
        this.containerElement.appendChild(div);
    }

    protected refreshItems(propertyItems: ElementPropertyItem[]): void {
        if (this.body === undefined) {
            return;
        }

        this.propertyItems = propertyItems;

        this.body.innerHTML = "";
        this.uiElements = [];

        if (this.propertyItems.length === 0) {
            this.body.appendChild(createEmptyPlaceholder());
        } else {
            for (const propertyItem of propertyItems) {
                let created: CreatedElementProperty | undefined = undefined;

                if (ElementTextPropertyItem.is(propertyItem)) {
                    created = createTextProperty(propertyItem, {
                        onblur: (item, input) => {
                            this.update(item.elementId, item.propertyId, input.value);
                        }
                    });
                }

                if (created !== undefined) {
                    this.body.appendChild(created.element);
                    this.uiElements.push(created.ui);
                }
            }
        }
    }

    protected async refresh(): Promise<SetPropertyPaletteAction> {
        return this.request(this.selectedItems[0]).then(response => {
            this.propertyItems = response.propertyItems;
            this.refreshItems(this.propertyItems);

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

function createIcon(codiconId: string): HTMLElement {
    const icon = document.createElement("i");
    icon.classList.add(...codiconCSSClasses(codiconId));
    return icon;
}

function createEmptyPlaceholder(): HTMLElement {
    const div = document.createElement("div");

    div.textContent = "No Properties found.";

    return div;
}
