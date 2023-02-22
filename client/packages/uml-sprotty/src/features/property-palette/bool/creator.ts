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
import { CreatedElementProperty } from "../model";
import { ElementBoolPropertyItem } from "./model";

export interface BoolPropertyEvents {
    onChange?: (item: ElementBoolPropertyItem, input: HTMLInputElement, event: Event) => void;
}

export function createBoolProperty(propertyItem: ElementBoolPropertyItem, events: BoolPropertyEvents): CreatedElementProperty {
    const div = document.createElement("div");
    div.classList.add("property-item", "property-bool-item");

    const label = document.createElement("label");
    label.classList.add("property-item-label");
    label.textContent = propertyItem.label;
    div.appendChild(label);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = propertyItem.value;
    input.addEventListener("change", ev => {
        events.onChange?.(propertyItem, input, ev);
    });
    div.appendChild(input);

    return {
        element: div,
        ui: {
            disable: () => {
                input.disabled = true;
            },
            enable: () => {
                input.disabled = false;
            }
        }
    };
}
