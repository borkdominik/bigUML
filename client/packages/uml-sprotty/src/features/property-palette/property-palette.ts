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
    SetUIExtensionVisibilityAction,
    TYPES
} from "@eclipse-glsp/client";
import { inject, injectable, postConstruct } from "inversify";

import {
    EnablePropertyPaletteAction,
    isSetPropertyPaletteAction,
    RequestPropertyPaletteAction,
    SetPropertyPaletteAction
} from "./actions";
import { ElementPropertyItem } from "./element-property-item";

@injectable()
export class PropertyPalette extends AbstractUIExtension implements IActionHandler {
    static readonly ID = "property-palette";

    @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: ActionDispatcher;
    @inject(EditorContextService) protected readonly editorContext: EditorContextService;

    protected paletteItems: ElementPropertyItem[];
    protected header: HTMLElement;
    protected body: HTMLElement;
    protected collapseButton: HTMLButtonElement;

    get isCollapsed(): boolean {
        return this.body.style.display === "none";
    }

    id(): string {
        return PropertyPalette.ID;
    }

    containerClass(): string {
        return PropertyPalette.ID;
    }

    override initialize(): boolean {
        if (!this.paletteItems) {
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
            this.request().then(response => {
                if (isSetPropertyPaletteAction(response)) {
                    this.paletteItems = response.propertyItems;
                    this.actionDispatcher.dispatch(
                        new SetUIExtensionVisibilityAction(PropertyPalette.ID, !this.editorContext.isReadonly)
                    );
                }
            });
        } else if (isSelectAction(action)) {
            this.request(action.selectedElementsIDs[0] ?? undefined)
                .then(response => {
                    console.log("Response", response);
                    this.paletteItems = response.propertyItems;
                    this.refreshItems(this.paletteItems);
                });
        }
    }

    editModeChanged(_oldValue: string, _newValue: string): void {
        this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(PropertyPalette.ID, !this.editorContext.isReadonly));
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

        this.refreshItems(this.paletteItems);
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

    protected refreshItems(items: ElementPropertyItem[]): void {
        console.log("Refresh items", items);
        this.paletteItems = items;
        this.body.innerHTML = "";

        for (const item of items) {
            let element: HTMLElement | undefined = undefined;
            switch (item.type) {
                case "TEXT":
                    element = createTextProperty(item);
                    break;
            }

            if (element !== undefined) {
                this.body.appendChild(element);
            }
        }
    }

    protected async request(elementId?: string): Promise<SetPropertyPaletteAction> {
        return this.actionDispatcher.request<SetPropertyPaletteAction>(new RequestPropertyPaletteAction(elementId));
    }
}

function createIcon(codiconId: string): HTMLElement {
    const icon = document.createElement("i");
    icon.classList.add(...codiconCSSClasses(codiconId));
    return icon;
}

function createTextProperty(propertyItem: ElementPropertyItem): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("property-item", "property-text-item");

    const label = document.createElement("label") as HTMLLabelElement;
    label.textContent = propertyItem.propertyId;
    div.appendChild(label);

    const input = document.createElement("input") as HTMLInputElement;
    input.type = "text";
    div.appendChild(input);

    return div;
}
