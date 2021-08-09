/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
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
import { EditLabelUI, getAbsoluteClientBounds, getZoom, isSizeable, SModelRoot } from "sprotty/lib";
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
        // TODO - is endsWith too strict?
        if (this.editControl.value && !this.editControl.value.trim().endsWith(":")) {
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
        const input: string = this.inputElement.value;
        let val = "";
        if (input.includes(":")) {
            val = input.split(":")[1].trim();
        } else {
            return;
        }

        this.closeAllLists();
        this.currentFocus = -1;

        this.listContainer = document.createElement("div");
        this.listContainer.setAttribute("id", this.inputElement.id + "autocomplete-list");
        this.listContainer.setAttribute("class", "autocomplete-items");
        this.outerDiv.appendChild(this.listContainer);

        // create autocomlete items starting with input
        for (let i = 0; i < this.types.length; i++) {
            if (this.types[i].substr(0, val.length).toLowerCase() === val.toLowerCase()) {
                const element = document.createElement("div");
                element.setAttribute("class", "autocomplete-item");
                element.innerHTML = "<strong>" + this.types[i].substr(0, val.length) + "</strong>";
                element.innerHTML += this.types[i].substr(val.length);
                element.innerHTML += "<input type='hidden' value='" + this.types[i] + "'>";
                element.addEventListener("click", e => {
                    // change the type of the label
                    let name: string = this.inputElement.value;
                    if (name.includes(":")) {
                        name = name.split(":")[0];
                    }
                    this.inputElement.value = name + ": " + element.getElementsByTagName("input")[0].value;
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

    // Override the default behavior. Let the edit control completely overlap
    // the label node, when the label has a defined size (rather than using
    // an arbitrary fixed width).
    // FIXME Move to Sprotty?
    protected setPosition(containerElement: HTMLElement): void {
        let x = 0;
        let y = 0;
        let width = 100;
        let height = 20;

        if (this.label) {
            const zoom = getZoom(this.label);
            const bounds = getAbsoluteClientBounds(this.label, this.domHelper, this.viewerOptions);
            x = bounds.x + (this.label.editControlPositionCorrection ? this.label.editControlPositionCorrection.x : 0) * zoom;
            y = bounds.y + (this.label.editControlPositionCorrection ? this.label.editControlPositionCorrection.y : 0) * zoom;
            height = (this.label.editControlDimension ? this.label.editControlDimension.height :
                (isSizeable(this.label) ? this.label.bounds.height : height)) * zoom;
            width = (this.label.editControlDimension ? this.label.editControlDimension.width :
                (isSizeable(this.label) ? this.label.bounds.width : width)) * zoom;
        }

        containerElement.style.left = `${x}px`;
        containerElement.style.top = `${y}px`;
        containerElement.style.width = `${width}px`;
        this.editControl.style.width = `${width}px`;
        containerElement.style.height = `${height}px`;
        this.editControl.style.height = `${height}px`;
    }

    protected isAutoCompleteEnabled(): boolean {
        if (this.label) {
            return this.label.type === UmlTypes.PROPERTY && this.showAutocomplete;
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
