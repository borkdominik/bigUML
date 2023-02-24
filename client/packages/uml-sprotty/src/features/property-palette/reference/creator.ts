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
import { codiconCSSClasses } from '@eclipse-glsp/client';

import { CreatedElementProperty } from '../model';
import { ElementReferencePropertyItem } from './model';

interface State {
    isReadOnly: boolean;
    propertyItem: ElementReferencePropertyItem;
    events: ReferencePropertyEvents;
    selectedReferences: SelectedReference[];
    dom: { [key: string]: HTMLElement };
    interactableElements: { [key: string]: HTMLButtonElement };
}

interface SelectedReference {
    originIndex: number;
    reference: ElementReferencePropertyItem.Reference;
}

export interface ReferencePropertyEvents {
    onCreate?: (
        item: ElementReferencePropertyItem,
        createType: ElementReferencePropertyItem.CreateReference,
        state: State
    ) => Promise<void>;
    onDelete?: (item: ElementReferencePropertyItem, selectedReferences: SelectedReference[], state: State) => Promise<void>;
    onNavigate?: (item: ElementReferencePropertyItem, reference: ElementReferencePropertyItem.Reference, state: State) => Promise<void>;
    onMove?: (
        item: ElementReferencePropertyItem,
        selectedReferences: SelectedReference[],
        direction: 'UP' | 'DOWN',
        state: State
    ) => Promise<void>;
}

export function createReferenceProperty(
    propertyItem: ElementReferencePropertyItem,
    events: ReferencePropertyEvents,
    initialState: Partial<Pick<State, 'selectedReferences'>> = {}
): CreatedElementProperty {
    const state: State = {
        isReadOnly: propertyItem.creates.length === 0,
        selectedReferences:
            initialState?.selectedReferences?.map(
                r =>
                    ({
                        reference: r.reference,
                        originIndex: propertyItem.references.findIndex(pr => pr.elementId === r.reference.elementId)
                    } as SelectedReference)
            ) ?? [],
        interactableElements: {},
        propertyItem,
        events,
        dom: {}
    };

    const div = document.createElement('div');
    div.classList.add('property-item', 'property-reference-item');

    const label = document.createElement('label');
    label.classList.add('property-item-label');
    label.textContent = propertyItem.label;
    div.appendChild(label);

    const referenceContainer = document.createElement('div');
    referenceContainer.classList.add('reference-container', 'property-item-full');
    referenceContainer.appendChild(createReferenceHeader(state));
    referenceContainer.appendChild(createReferenceBody(state));

    div.appendChild(referenceContainer);

    return {
        element: div,
        ui: {
            disable: () => {
                Object.values(state.interactableElements).forEach(e => (e.disabled = true));
            },
            enable: () => {
                Object.values(state.interactableElements).forEach(e => (e.disabled = false));
            }
        }
    };
}

function createReferenceHeader(state: State): HTMLDivElement {
    const header = document.createElement('div');
    header.classList.add('reference-container-header');

    const create = state.propertyItem.creates[0];

    if (create !== undefined) {
        state.isReadOnly = false;

        const createReferenceButton = document.createElement('button');
        createReferenceButton.classList.add('reference-create-reference', 'property-button');
        createReferenceButton.appendChild(createIcon('plus'));
        createReferenceButton.addEventListener('click', async () => state.events.onCreate?.(state.propertyItem, create, state));
        header.appendChild(createReferenceButton);

        state.interactableElements['create-reference-button'] = createReferenceButton;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('reference-delete', 'property-button');
        deleteButton.appendChild(createIcon('close'));
        deleteButton.addEventListener('click', async () => state.events.onDelete?.(state.propertyItem, state.selectedReferences, state));
        header.appendChild(deleteButton);

        state.interactableElements['delete-button'] = deleteButton;
    }

    if (state.propertyItem.isOrderable) {
        const moveUpButton = document.createElement('button');
        moveUpButton.classList.add('reference-move-up', 'property-button');
        moveUpButton.appendChild(createIcon('chevron-up'));
        moveUpButton.addEventListener('click', async () =>
            state.events.onMove?.(state.propertyItem, state.selectedReferences, 'UP', state)
        );
        header.appendChild(moveUpButton);

        state.interactableElements['move-up-button'] = moveUpButton;

        const moveDownButton = document.createElement('button');
        moveDownButton.classList.add('reference-move-down', 'property-button');
        moveDownButton.appendChild(createIcon('chevron-down'));
        moveDownButton.addEventListener('click', async () =>
            state.events.onMove?.(state.propertyItem, state.selectedReferences, 'DOWN', state)
        );
        header.appendChild(moveDownButton);

        state.interactableElements['move-down-button'] = moveDownButton;
    }

    if (create !== undefined || state.propertyItem.isOrderable) {
        const checkAllButton = document.createElement('button');
        checkAllButton.classList.add('reference-check-all', 'property-button');
        checkAllButton.appendChild(createIcon('check-all'));
        checkAllButton.addEventListener('click', async () => {
            if (state.selectedReferences.length === state.propertyItem.references.length) {
                accessDom(
                    state,
                    state.selectedReferences.map(r => r.reference.elementId),
                    '.reference-label-container',
                    e => e.click()
                );
            } else {
                accessDom(
                    state,
                    state.selectedReferences.map(r => r.reference.elementId),
                    '.reference-label-container',
                    e => e.click()
                );
                accessDom(
                    state,
                    state.propertyItem.references.map(r => r.elementId),
                    '.reference-label-container',
                    e => e.click()
                );
            }
        });
        header.appendChild(checkAllButton);

        state.interactableElements['check-all-button'] = checkAllButton;
    }

    return header;
}

const selectedClass = 'reference-element-selected';
function createReferenceBody(state: State): HTMLDivElement {
    const body = document.createElement('div');
    body.classList.add('reference-container-body');

    const selectedsIds = state.selectedReferences.map(r => r.reference.elementId);
    state.propertyItem.references.forEach((reference, index) => {
        const referenceElement = document.createElement('div');
        referenceElement.classList.add('reference-element');

        const labelContainer = document.createElement('div');
        labelContainer.classList.add('reference-label-container');
        referenceElement.appendChild(labelContainer);

        if (reference.isReadonly) {
            referenceElement.classList.add('reference-readonly');
        }

        if (!(state.isReadOnly || reference.isReadonly)) {
            const isChecked = selectedsIds.includes(reference.elementId);
            const checkState = createIcon(isChecked ? 'pass' : 'circle-large-outline');
            checkState.classList.add('reference-check-state');
            labelContainer.appendChild(checkState);

            labelContainer.addEventListener('click', event => {
                event.stopPropagation();

                if (referenceElement.classList.contains(selectedClass)) {
                    referenceElement.classList.remove(selectedClass);
                    checkState.classList.replace('codicon-pass', 'codicon-circle-large-outline');
                    state.selectedReferences = state.selectedReferences.filter(s => s.reference.elementId !== reference.elementId);
                } else {
                    checkState.classList.replace('codicon-circle-large-outline', 'codicon-pass');
                    referenceElement.classList.add(selectedClass);
                    state.selectedReferences.push({
                        originIndex: index,
                        reference
                    });
                }
            });
        }

        const referenceLabel = document.createElement('label');
        referenceLabel.textContent = reference.label;
        labelContainer.appendChild(referenceLabel);

        const referenceNavigate = document.createElement('button');
        referenceNavigate.classList.add('reference-element-navigate', 'property-button');
        referenceNavigate.appendChild(createIcon('chevron-right'));
        referenceNavigate.addEventListener('click', () => state.events.onNavigate?.(state.propertyItem, reference, state));

        referenceElement.appendChild(referenceNavigate);

        state.dom[reference.elementId] = referenceElement;
        body.appendChild(referenceElement);
    });

    return body;
}

function createIcon(codiconId: string): HTMLElement {
    const icon = document.createElement('i');
    icon.classList.add(...codiconCSSClasses(codiconId));
    return icon;
}

function accessDom(state: State, ids: string[], selector: string, callback: (element: HTMLElement) => void): void {
    ids.forEach(id =>
        state.dom[id].querySelectorAll(selector).forEach(element => {
            callback(element as HTMLElement);
        })
    );
}
