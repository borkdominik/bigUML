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
import { EditLabelUI, EditLabelValidationResult, GLSPActionDispatcher, SModelRoot, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';

import { UmlTypes } from '../../utils';
import { RequestTypeInformationAction, SetTypeInformationAction, TypeInformation } from './edit-label.actions';

@injectable()
export class EditLabelUIAutocomplete extends EditLabelUI {
    protected showAutocomplete = false;
    protected outerDiv: HTMLElement;
    protected listContainer: HTMLElement;
    protected currentFocus: number;
    protected typeInformation: TypeInformation[] = [];

    constructor(
        @inject(TYPES.IActionDispatcher)
        protected actionDispatcher: GLSPActionDispatcher
    ) {
        super();
    }

    protected override initializeContents(containerElement: HTMLElement): void {
        this.outerDiv = containerElement;
        super.initializeContents(containerElement);
    }

    protected override async validateLabel(value: string): Promise<EditLabelValidationResult> {
        if (this.isAutoCompleteLabel()) {
            let result: EditLabelValidationResult = {
                severity: 'error',
                message: 'Please select from the dropdown (strg + space)'
            };
            if (this.typeInformation.some(t => t.id === value)) {
                result = { severity: 'ok' };
            }

            this.isCurrentLabelValid = 'error' !== result.severity;
            this.showValidationResult(result);

            return result;
        }

        return super.validateLabel(value);
    }

    protected override configureAndAdd(element: HTMLInputElement | HTMLTextAreaElement, containerElement: HTMLElement): void {
        super.configureAndAdd(element, containerElement);
        element.addEventListener('keydown', event => this.handleKeyDown(event as KeyboardEvent));
        element.removeEventListener('blur', () => window.setTimeout(() => this.applyLabelEdit(), 200));
        element.addEventListener('blur', () => this.handleBlur());
    }

    protected handleKeyDown(event: KeyboardEvent): void {
        if (matchesKeystroke(event, 'Space', 'ctrl')) {
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
            window.setTimeout(() => this.hide(), 200);
        }
    }

    protected override validateLabelIfContentChange(event: KeyboardEvent, value: string): void {
        if (this.isAutoCompleteEnabled() && this.previousLabelContent !== value) {
            // recreate autocomplete list if value changed
            this.createAutocomplete();
        }
        super.validateLabelIfContentChange(event, value);
    }

    protected updateAutocomplete(event: KeyboardEvent): void {
        if (matchesKeystroke(event, 'ArrowDown')) {
            this.currentFocus++;
            this.addActive();
        } else if (matchesKeystroke(event, 'ArrowUp')) {
            this.currentFocus--;
            this.addActive();
        } else if (matchesKeystroke(event, 'Enter')) {
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

        this.listContainer = document.createElement('div');
        this.listContainer.setAttribute('id', this.inputElement.id + 'autocomplete-list');
        this.listContainer.setAttribute('class', 'autocomplete-items');
        this.outerDiv.appendChild(this.listContainer);

        // create autocomplete items starting with input
        for (let i = 0; i < this.typeInformation.length; i++) {
            const type = this.typeInformation[i];
            const label = type.name;
            if (label.substring(0, input.length).toLowerCase() === input.toLowerCase()) {
                const element = document.createElement('div');
                element.setAttribute('class', 'autocomplete-item');
                element.innerHTML = '<strong>' + label.substring(0, input.length) + '</strong>';
                element.innerHTML += label.substring(input.length);
                element.innerHTML += `</br><small> - ${type.type}</small>`;
                element.innerHTML += "<input type='hidden' value='" + type.id + "'>";
                element.addEventListener('click', event => {
                    // change the type of the label
                    event.stopPropagation();

                    this.inputElement.value = type.id;
                    this.inputElement.blur();
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
                this.currentFocus = children.length - 1;
            }
            children[this.currentFocus].classList.add('autocomplete-active');
        }
    }

    protected removeActive(): void {
        const children = this.listContainer.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('autocomplete-active');
        }
    }

    protected closeAllLists(): void {
        const x = this.outerDiv.getElementsByClassName('autocomplete-items');
        for (let i = 0; i < x.length; i++) {
            this.outerDiv.removeChild(x[i]);
        }
    }

    protected override onBeforeShow(containerElement: HTMLElement, root: Readonly<SModelRoot>, ...contextElementIds: string[]): void {
        super.onBeforeShow(containerElement, root, ...contextElementIds);

        // request possible element types
        this.actionDispatcher.requestUntil<SetTypeInformationAction>(new RequestTypeInformationAction()).then(response => {
            if (response) {
                this.typeInformation = response.typeInformation.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }

    protected isAutoCompleteEnabled(): boolean {
        if (this.label) {
            return this.isAutoCompleteLabel() && this.showAutocomplete;
        }
        return false;
    }

    protected isAutoCompleteLabel(): boolean {
        return this.label?.type === UmlTypes.LABEL_PROPERTY_TYPE;
    }

    public override hide(): void {
        super.hide();
        this.showAutocomplete = false;
        this.currentFocus = -1;
        this.closeAllLists();
    }
}
