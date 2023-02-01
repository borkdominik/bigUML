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
import {
    CreatedElementProperty,
    ElementPropertyItem,
    ElementPropertyUI,
    PropertyPalette as PropertyPaletteModel
} from "./model";
import { createTextProperty, ElementTextPropertyItem } from "./text";

@injectable()
export class PropertyPalette extends AbstractUIExtension implements IActionHandler, SModelRootListener {
    static readonly ID = "property-palette";

    @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: ActionDispatcher;
    @inject(EditorContextService) protected readonly editorContext: EditorContextService;

    protected paletteAction?: SetPropertyPaletteAction;
    protected selectAction?: SelectAction;
    protected uiElements: ElementPropertyUI[] = [];

    protected header: HTMLElement;

    protected body: HTMLElement;
    protected bodyHeader: HTMLElement;
    protected bodyContent: HTMLElement;

    protected collapseButton: HTMLButtonElement;

    get isCollapsed(): boolean {
        return this.body.style.display === "none";
    }

    get selectedItems(): string[] {
        return this.selectAction?.selectedElementsIDs ?? [];
    }

    get palette(): PropertyPaletteModel | undefined {
        return this.paletteAction?.palette;
    }

    id(): string {
        return PropertyPalette.ID;
    }

    containerClass(): string {
        return PropertyPalette.ID;
    }

    override initialize(): boolean {
        if (!this.paletteAction) {
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

        this.refreshUi(this.palette);
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
        const body = document.createElement("div");
        body.classList.add("property-palette-body");

        this.body = body;
        this.containerElement.appendChild(body);

        const bodyHeader = document.createElement("div");
        bodyHeader.classList.add("property-palette-body-header");

        this.bodyHeader = bodyHeader;
        this.body.appendChild(bodyHeader);

        const bodyContent = document.createElement("div");
        bodyContent.classList.add("property-palette-body-content");

        this.bodyContent = bodyContent;
        this.body.appendChild(bodyContent);

    }

    protected refreshUi(palette?: PropertyPaletteModel): void {
        if (this.body === undefined) {
            return;
        }

        if (palette === undefined) {
            this.bodyContent.innerHTML = "";
            setEmptyPlaceholder(this.bodyHeader);
        } else {
            this.refreshHeader(palette);
            this.refreshContent(palette.items);
        }
    }

    protected refreshHeader(palette: PropertyPaletteModel): void {
        const label = palette.label;
        if (label !== undefined) {
            this.bodyHeader.textContent = label;
        } else {
            setEmptyPlaceholder(this.bodyHeader);
        }
    }

    protected refreshContent(items: ElementPropertyItem[]): void {
        this.bodyContent.innerHTML = "";
        this.uiElements = [];

        if (items !== undefined) {
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
                }

                if (created !== undefined) {
                    this.bodyContent.appendChild(created.element);
                    this.uiElements.push(created.ui);
                }
            }
        }
    }

    protected async refresh(): Promise<SetPropertyPaletteAction> {
        return this.request(this.selectedItems[0]).then(response => {
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

function createIcon(codiconId: string): HTMLElement {
    const icon = document.createElement("i");
    icon.classList.add(...codiconCSSClasses(codiconId));
    return icon;
}

function setEmptyPlaceholder(container: HTMLElement): void {
    const div = document.createElement("div");

    div.textContent = "No Properties found.";

    container.innerHTML = "";
    container.appendChild(div);
}
