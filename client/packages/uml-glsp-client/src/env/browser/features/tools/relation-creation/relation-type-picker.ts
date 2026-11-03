/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import type { RelationType } from '@borkdominik-biguml/uml-glsp-server';
import {
    Disposable,
    EditorContextService,
    type GModelRoot,
    GLSPAbstractUIExtension,
    matchesKeystroke,
    type Point
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

export interface RelationTypePickerOptions {
    /** The relations to choose from - more than one, or there would be nothing to choose. */
    relationTypes: RelationType[];
    /** Where the relation was dropped, in client coordinates. The picker opens next to it. */
    position: Point;
    onSelect(relationType: RelationType): void;
    /** Called when the picker is dismissed - Escape, or a click anywhere outside it. */
    onCancel(): void;
}

/** How far from the cursor the picker opens, so the cursor does not cover its first entry. */
const CURSOR_OFFSET = 4;

/**
 * The list of relations the "Create relation" tool lets the user choose from when the two ends picked
 * admit more than one. Opens at the cursor, with the first relation focused: the arrow keys move through
 * the list, Enter creates the focused relation, and Escape or a click elsewhere dismisses it.
 */
@injectable()
export class RelationTypePicker extends GLSPAbstractUIExtension {
    static readonly ID = 'relation-type-picker';

    @inject(EditorContextService) protected readonly editorContext: EditorContextService;

    protected request?: RelationTypePickerOptions;
    protected list: HTMLElement;

    id(): string {
        return RelationTypePicker.ID;
    }

    containerClass(): string {
        return RelationTypePicker.ID;
    }

    /** Opens the picker for `options`, dismissing a choice that may still be open. */
    open(options: RelationTypePickerOptions): void {
        this.cancel();
        this.request = options;
        this.show(this.editorContext.modelRoot);
    }

    /** Closes the picker without answering - for when whoever opened it no longer waits for the choice. */
    close(): void {
        this.request = undefined;
        if (this.initialized && this.isContainerVisible()) {
            this.hide();
        }
    }

    override show(root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
        super.show(root, ...contextElementIds);
        // Only once visible: a hidden element can neither be measured nor take the focus.
        this.keepInView(this.containerElement);
        this.items()[0]?.focus();

        const dismissOutside = (event: PointerEvent): void => {
            if (!this.containerElement.contains(event.target as Node)) {
                this.cancel();
            }
        };
        // Captured, so the click is seen before the diagram takes it - and the diagram still gets it.
        document.addEventListener('pointerdown', dismissOutside, true);
        this.toDisposeOnHide.push(Disposable.create(() => document.removeEventListener('pointerdown', dismissOutside, true)));
    }

    protected override initializeContents(containerElement: HTMLElement): void {
        containerElement.setAttribute('role', 'dialog');
        containerElement.setAttribute('aria-label', 'Create relation');

        const header = document.createElement('div');
        header.classList.add('relation-type-picker-header');
        header.textContent = 'Create relation';
        containerElement.appendChild(header);

        this.list = document.createElement('div');
        this.list.classList.add('relation-type-picker-list');
        this.list.setAttribute('role', 'listbox');
        containerElement.appendChild(this.list);

        containerElement.addEventListener('keydown', event => this.onKeyDown(event));
    }

    protected override onBeforeShow(containerElement: HTMLElement, _root: Readonly<GModelRoot>): void {
        this.list.replaceChildren(...(this.request?.relationTypes ?? []).map(relationType => this.createItem(relationType)));
        const position = this.request?.position ?? { x: 0, y: 0 };
        containerElement.style.left = `${position.x + CURSOR_OFFSET}px`;
        containerElement.style.top = `${position.y + CURSOR_OFFSET}px`;
    }

    protected createItem(relationType: RelationType): HTMLElement {
        const item = document.createElement('button');
        item.type = 'button';
        item.classList.add('relation-type-picker-item');
        item.setAttribute('role', 'option');
        item.title = relationType.label;

        const icon = document.createElement('div');
        icon.classList.add('uml-icon', relationType.icon);
        item.appendChild(icon);

        const label = document.createElement('span');
        label.textContent = relationType.label;
        item.appendChild(label);

        item.addEventListener('click', () => this.select(relationType));
        item.addEventListener('mouseenter', () => item.focus());
        return item;
    }

    protected onKeyDown(event: KeyboardEvent): void {
        const items = this.items();
        const current = items.indexOf(document.activeElement as HTMLElement);
        let next: number | undefined;
        if (matchesKeystroke(event, 'ArrowDown')) {
            next = (current + 1) % items.length;
        } else if (matchesKeystroke(event, 'ArrowUp')) {
            next = (current - 1 + items.length) % items.length;
        } else if (matchesKeystroke(event, 'Home')) {
            next = 0;
        } else if (matchesKeystroke(event, 'End')) {
            next = items.length - 1;
        } else if (matchesKeystroke(event, 'Escape')) {
            this.cancel();
        } else {
            // Enter and Space press the focused button by themselves.
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (next !== undefined) {
            items[next]?.focus();
        }
    }

    protected select(relationType: RelationType): void {
        const request = this.request;
        this.close();
        request?.onSelect(relationType);
    }

    protected cancel(): void {
        const request = this.request;
        this.close();
        request?.onCancel();
    }

    protected items(): HTMLElement[] {
        return Array.from(this.list.querySelectorAll<HTMLElement>('.relation-type-picker-item'));
    }

    /** Moves the picker back inside the window where opening it at the cursor would cut it off. */
    protected keepInView(containerElement: HTMLElement): void {
        const bounds = containerElement.getBoundingClientRect();
        if (bounds.right > window.innerWidth) {
            containerElement.style.left = `${Math.max(0, window.innerWidth - bounds.width)}px`;
        }
        if (bounds.bottom > window.innerHeight) {
            containerElement.style.top = `${Math.max(0, window.innerHeight - bounds.height)}px`;
        }
    }
}
