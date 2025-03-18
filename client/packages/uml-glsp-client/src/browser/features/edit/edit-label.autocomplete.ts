/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    ApplyLabelEditOperation,
    CommitModelAction,
    EditLabelUI,
    type EditLabelValidationResult,
    EditorContextService,
    type GLSPActionDispatcher,
    type GModelRoot,
    hasArgs,
    RequestContextActions,
    SetContextActions,
    TYPES
} from '@eclipse-glsp/client';
import { type KeyboardModifier, type KeyCode, matchesKeystroke } from '@eclipse-glsp/sprotty';
import { inject, injectable } from 'inversify';
import { type AutocompleteEntry } from '../../../common/index.js';
import { AutocompleteConstants } from '../autocomplete/autocomplete.constants.js';

@injectable()
export class EditLabelUIAutocomplete extends EditLabelUI {
    @inject(EditorContextService) protected editorContext: EditorContextService;
    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: GLSPActionDispatcher;

    protected outerDiv: HTMLElement;
    protected listContainer: HTMLElement;
    protected currentFocus: number;
    protected autocompleteEntries: AutocompleteEntry[] = [];

    protected get isAutocompleteEnabled(): boolean {
        return this.outerDiv.querySelector(`#${EditLabelUIAutocompleteUtils.autocompleteDivId(this.inputElement.id)}`) !== null;
    }

    protected get isAutocompleteLabel(): boolean {
        if (this.label === undefined) {
            return false;
        }

        if (hasArgs(this.label)) {
            return this.label.args[AutocompleteConstants.gmodelFeature] === true;
        }

        return false;
    }

    protected override initializeContents(containerElement: HTMLElement): void {
        this.outerDiv = containerElement;
        super.initializeContents(containerElement);
    }

    protected override configureAndAdd(element: HTMLInputElement | HTMLTextAreaElement, containerElement: HTMLElement): void {
        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.top = '0px';
        element.style.left = '0px';
        element.addEventListener('keyup', event => {
            event.stopPropagation();
            this.onContentChange(event as KeyboardEvent, element.value);
            this.validateLabelIfContentChange(event as KeyboardEvent, element.value);
        });
        element.addEventListener('keydown', event => {
            event.stopPropagation();
            this.handleAutocompleteMatch(event as KeyboardEvent);
            this.hideIfEscapeEvent(event as KeyboardEvent);
        });
        element.addEventListener('blur', () => this.handleBlur());

        containerElement.appendChild(element);
    }

    protected override onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
        super.onBeforeShow(containerElement, root, ...contextElementIds);

        // request entries
        const requestAction = RequestContextActions.create({
            contextId: AutocompleteConstants.contextId,
            editorContext: this.editorContext.get({
                labelId: this.label!.id
            })
        });
        this.actionDispatcher.requestUntil(requestAction).then(response => {
            if (SetContextActions.is(response)) {
                this.autocompleteEntries = response.actions.sort((a, b) => a.label.localeCompare(b.label));
            }
        });
    }

    public override show(root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
        super.show(root, ...contextElementIds);
        if (this.isAutocompleteLabel) {
            this.showAutocomplete();
        }
    }

    public override hide(): void {
        super.hide();
        this.currentFocus = -1;
        this.hideAutocomplete();
    }

    protected override async validateLabel(value: string): Promise<EditLabelValidationResult> {
        if (this.isAutocompleteLabel) {
            let result: EditLabelValidationResult = {
                severity: 'error',
                message: 'Please select from the dropdown'
            };

            if (this.autocompleteEntries.some(t => t.label === value)) {
                result = { severity: 'ok' };
            }

            this.isCurrentLabelValid = 'error' !== result.severity;
            this.showValidationResult(result);

            return result;
        }

        return super.validateLabel(value);
    }

    protected onContentChange(_event: KeyboardEvent, value: string): void {
        if (this.isAutocompleteEnabled && this.previousLabelContent !== value) {
            // recreate autocomplete list if value changed
            this.showAutocomplete();
        }
    }

    protected override applyLabelEditOnEvent(event: KeyboardEvent, code?: KeyCode, ...modifiers: KeyboardModifier[]): void {
        if (!this.isAutocompleteEnabled && matchesKeystroke(event, code ? code : 'Enter', ...modifiers)) {
            event.preventDefault();
            this.applyLabelEdit();
        }
    }

    protected override async applyLabelEdit(): Promise<void> {
        if (!this.isActive) {
            return;
        }
        if (this.label?.text === this.editControl.value) {
            // no action necessary
            this.hide();
            return;
        }
        if (this.blockApplyEditOnInvalidInput) {
            const result = await this.validateLabel(this.editControl.value);
            if ('error' === result.severity) {
                this.editControl.focus();
                return;
            }
        }
        this.actionDispatcher.dispatchAll([
            ApplyLabelEditOperation.create({ labelId: this.labelId, text: this.editControl.value }),
            CommitModelAction.create()
        ]);
        this.hide();
    }

    protected handleBlur(): void {
        if (this.editControl.value && !this.isAutocompleteEnabled) {
            window.setTimeout(() => this.applyLabelEdit(), 200);
        } else {
            window.setTimeout(() => this.hide(), 200);
        }
    }

    protected showAutocomplete(): void {
        const input = this.inputElement.value;
        this.hideAutocomplete();
        this.currentFocus = -1;

        this.listContainer = document.createElement('div');
        this.listContainer.setAttribute('id', EditLabelUIAutocompleteUtils.autocompleteDivId(this.inputElement.id));
        this.listContainer.setAttribute('class', 'autocomplete-items');
        this.outerDiv.appendChild(this.listContainer);

        // create autocomplete items starting with input
        for (let i = 0; i < this.autocompleteEntries.length; i++) {
            const entry = this.autocompleteEntries[i];
            const label = entry.label;
            if (label.substring(0, input.length).toLowerCase() === input.toLowerCase()) {
                const element = document.createElement('div');
                element.setAttribute('class', 'autocomplete-item');
                element.innerHTML = '<strong>' + label.substring(0, input.length) + '</strong>';
                element.innerHTML += label.substring(input.length);
                element.innerHTML += `</br><small> - ${entry.hint}</small>`;
                element.innerHTML += "<input type='hidden' value='" + entry.label + "'>";
                element.addEventListener('click', event => {
                    // change the type of the label
                    event.stopPropagation();
                    this.applyAutocompleteEdit(entry);
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

    protected hideAutocomplete(): void {
        const x = this.outerDiv.getElementsByClassName('autocomplete-items');
        for (let i = 0; i < x.length; i++) {
            this.outerDiv.removeChild(x[i]);
        }
    }

    protected handleAutocompleteMatch(event: KeyboardEvent): void {
        if (this.isAutocompleteEnabled) {
            if (matchesKeystroke(event, 'ArrowDown')) {
                this.currentFocus++;
                this.highlightActiveElement();
            } else if (matchesKeystroke(event, 'ArrowUp')) {
                this.currentFocus--;
                this.highlightActiveElement();
            } else if (matchesKeystroke(event, 'Enter')) {
                event.preventDefault();
                if (this.currentFocus > -1) {
                    if (this.listContainer) {
                        const children = this.listContainer.children;
                        (children[this.currentFocus] as HTMLElement).click();
                    }
                } else {
                    const entry = this.autocompleteEntries.find(t => t.label.toLowerCase() === this.editControl.value.toLowerCase());
                    if (entry !== undefined) {
                        this.applyAutocompleteEdit(entry);
                    }
                }
            }
        }
    }

    protected applyAutocompleteEdit(entry: AutocompleteEntry): void {
        this.actionDispatcher.dispatchAll([...entry.actions, CommitModelAction.create()]);
        this.hide();
    }

    protected highlightActiveElement(): void {
        if (!this.listContainer) {
            return;
        }
        this.removeHighlight();
        const children = this.listContainer.children;
        if (children.length > 0) {
            if (this.currentFocus >= children.length) {
                this.currentFocus = 0;
            }
            if (this.currentFocus < 0) {
                this.currentFocus = children.length - 1;
            }
            const child = children[this.currentFocus] as HTMLElement;
            child.classList.add('autocomplete-active');
            child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    }

    protected removeHighlight(): void {
        const children = this.listContainer.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('autocomplete-active');
        }
    }
}

export namespace EditLabelUIAutocompleteUtils {
    export function autocompleteDivId(inputId: string): string {
        return inputId + '_autocomplete-list';
    }
}
