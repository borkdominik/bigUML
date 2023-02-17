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
import { codiconCSSClasses } from "@eclipse-glsp/client";

import { CreatedElementProperty } from "../model";
import { ElementReferencePropertyItem } from "./model";

interface State {
    propertyItem: ElementReferencePropertyItem;
    events: ReferencePropertyEvents;
    selectedElements: ElementReferencePropertyItem.Reference[];
}

export interface ReferencePropertyEvents {
    onCreate?: (item: ElementReferencePropertyItem, createType: ElementReferencePropertyItem.CreateReference) => Promise<void>;
    onDelete?: (item: ElementReferencePropertyItem, references: ElementReferencePropertyItem.Reference[]) => Promise<void>;
    onNavigate?: (item: ElementReferencePropertyItem, reference: ElementReferencePropertyItem.Reference) => Promise<void>;
}

export function createReferenceProperty(propertyItem: ElementReferencePropertyItem, events: ReferencePropertyEvents): CreatedElementProperty {
    const state: State = {
        selectedElements: [],
        propertyItem,
        events
    };

    const div = document.createElement("div");
    div.classList.add("property-item", "property-reference-item");

    const label = document.createElement("label");
    label.classList.add("property-item-label");
    label.textContent = propertyItem.label;
    div.appendChild(label);

    const referenceContainer = document.createElement("div");
    referenceContainer.classList.add("reference-container", "property-item-full");
    referenceContainer.appendChild(createReferenceHeader(state));
    referenceContainer.appendChild(createReferenceBody(state));

    div.appendChild(referenceContainer);

    return {
        element: div,
        ui: {
            disable: () => {
                // NOOP
            },
            enable: () => {
                // NOOP
            }
        }
    };
}

function createReferenceHeader(state: State): HTMLDivElement {
    const header = document.createElement("div");
    header.classList.add("reference-container-header");

    const create = state.propertyItem.creates[0];

    if (create !== undefined) {
        const createReferenceButton = document.createElement("button");
        createReferenceButton.classList.add("reference-create-reference");
        createReferenceButton.appendChild(createIcon("plus"));
        createReferenceButton.addEventListener("click", async () => state.events.onCreate?.(state.propertyItem, create));
        header.appendChild(createReferenceButton);
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("reference-delete");
    deleteButton.appendChild(createIcon("close"));
    deleteButton.addEventListener("click", async () => state.events.onDelete?.(state.propertyItem, state.selectedElements));
    header.appendChild(deleteButton);

    return header;
}

const selectedClass = "reference-element-selected";
function createReferenceBody(state: State): HTMLDivElement {
    const body = document.createElement("div");
    body.classList.add("reference-container-body");

    state.propertyItem.references.forEach(reference => {
        const referenceElement = document.createElement("div");
        referenceElement.classList.add("reference-element");
        referenceElement.addEventListener("click", () => {
            if (referenceElement.classList.contains(selectedClass)) {
                referenceElement.classList.remove(selectedClass);
                state.selectedElements = state.selectedElements.filter(s => s.elementId !== reference.elementId);
            } else {
                referenceElement.classList.add(selectedClass);
                state.selectedElements.push(reference);
            }
        });

        const referenceLabel = document.createElement("label");
        referenceLabel.textContent = reference.label;
        referenceElement.appendChild(referenceLabel);

        const referenceNavigate = document.createElement("button");
        referenceNavigate.classList.add("reference-element-navigate");
        referenceNavigate.appendChild(createIcon("chevron-right"));
        referenceNavigate.addEventListener("click", () => state.events.onNavigate?.(state.propertyItem, reference));

        referenceElement.appendChild(referenceNavigate);

        body.appendChild(referenceElement);
    });

    return body;
}

function createIcon(codiconId: string): HTMLElement {
    const icon = document.createElement("i");
    icon.classList.add(...codiconCSSClasses(codiconId));
    return icon;
}
