/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { GLSPActionDispatcher, TYPES } from "@eclipse-glsp/client/lib";
import { inject, injectable } from "inversify";
import { EditLabelUI, SModelRoot } from "sprotty/lib";
import { matchesKeystroke } from "sprotty/lib/utils/keyboard";

import { UmlTypes } from "../../utils";
import { GetTypesAction, ReturnTypesAction } from "./action-definitions";

@injectable()
export class EditLabelUIAutocomplete extends EditLabelUI {

    protected showAutocomplete = false;
    protected outerDiv: HTMLElement;
    protected listContainer: HTMLElement;
    protected currentFocus: number;
    protected types: string[] = [];

    constructor(@inject(TYPES.IActionDispatcher) protected actionDispatcher: GLSPActionDispatcher) {
        super();
    }

    protected initializeContents(containerElement: HTMLElement): void {
        this.outerDiv = containerElement;
        super.initializeContents(containerElement);
    }

    protected configureAndAdd(element: HTMLInputElement | HTMLTextAreaElement, containerElement: HTMLElement): void {
        super.configureAndAdd(element, containerElement);
        element.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
        element.removeEventListener("blur", () => window.setTimeout(() => this.applyLabelEdit(), 200));
        element.addEventListener("blur", () => this.handleBlur());
    }

    protected handleKeyDown(event: KeyboardEvent): void {
        if (matchesKeystroke(event, "Space", "ctrl")) {
            this.showAutocomplete = true;
            if (this.isAutoCompleteEnabled()) {
                this.createAutocomplete();
            }
        }
        this.updateAutocomplete(event);
    }

    protected handleBlur(): void {
        if (this.editControl.value) {
            window.setTimeout(() => this.applyLabelEdit(), 200);
        } else {
            this.hide();
        }
    }

    protected validateLabelIfContentChange(event: KeyboardEvent, value: string): void {
        if (this.isAutoCompleteEnabled() && this.previousLabelContent !== value) {
            // recreate autocomplete list if value changed
            this.createAutocomplete();
        }
        super.validateLabelIfContentChange(event, value);
    }

    protected updateAutocomplete(event: KeyboardEvent): void {
        if (matchesKeystroke(event, "ArrowDown")) {
            this.currentFocus++;
            this.addActive();
        } else if (matchesKeystroke(event, "ArrowUp")) {
            this.currentFocus--;
            this.addActive();
        } else if (matchesKeystroke(event, "Enter")) {
            event.preventDefault();
            if (this.currentFocus > -1) {
                if (this.listContainer) {
                    const children = this.listContainer.children;
                    (children[this.currentFocus] as HTMLElement).click();
                }
            }
        }
    }

    protected createAutocomplete(): void {
        const input = this.inputElement.value;

        this.closeAllLists();
        this.currentFocus = -1;

        this.listContainer = document.createElement("div");
        this.listContainer.setAttribute("id", this.inputElement.id + "autocomplete-list");
        this.listContainer.setAttribute("class", "autocomplete-items");
        this.outerDiv.appendChild(this.listContainer);

        // create autocomplete items starting with input
        for (let i = 0; i < this.types.length; i++) {
            if (this.types[i].substring(0, input.length).toLowerCase() === input.toLowerCase()) {
                const element = document.createElement("div");
                element.setAttribute("class", "autocomplete-item");
                element.innerHTML = "<strong>" + this.types[i].substring(0, input.length) + "</strong>";
                element.innerHTML += this.types[i].substring(input.length);
                element.innerHTML += "<input type='hidden' value='" + this.types[i] + "'>";
                element.addEventListener("click", () => {
                    // change the type of the label
                    this.inputElement.value = element.getElementsByTagName("input")[0].value;
                    this.closeAllLists();
                });
                this.listContainer.appendChild(element);
            }
        }

        // set max height for scrolling
        const parent = this.outerDiv.parentElement;
        if (parent) {
            const parentHeight = parent.offsetHeight;
            const parentPosY = parent.offsetTop;
            const posY = this.outerDiv.offsetTop + this.inputElement.offsetHeight;
            const maxHeight = parentHeight - (posY - parentPosY);
            this.listContainer.style.maxHeight = `${maxHeight}px`;
        }
    }

    protected addActive(): void {
        if (!this.listContainer) {
            return;
        }
        this.removeActive();
        const children = this.listContainer.children;
        if (children.length > 0) {
            if (this.currentFocus >= children.length) {
                this.currentFocus = 0;
            }
            if (this.currentFocus < 0) {
                this.currentFocus = (children.length - 1);
            }
            children[this.currentFocus].classList.add("autocomplete-active");
        }
    }

    protected removeActive(): void {
        const children = this.listContainer.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove("autocomplete-active");
        }
    }

    protected closeAllLists(): void {
        const x = this.outerDiv.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            this.outerDiv.removeChild(x[i]);
        }
    }

    protected onBeforeShow(containerElement: HTMLElement, root: Readonly<SModelRoot>, ...contextElementIds: string[]): void {
        super.onBeforeShow(containerElement, root, ...contextElementIds);

        // request possible element types
        this.actionDispatcher.requestUntil(new GetTypesAction()).then(response => {
            if (response) {
                const action: ReturnTypesAction = response as ReturnTypesAction;
                this.types = action.types;
            }
        });
    }

    protected isAutoCompleteEnabled(): boolean {
        if (this.label) {
            return this.label.type === UmlTypes.LABEL_PROPERTY_TYPE && this.showAutocomplete;
        }
        return false;
    }

    public hide(): void {
        super.hide();
        this.showAutocomplete = false;
        this.currentFocus = -1;
        this.closeAllLists();
    }
}
