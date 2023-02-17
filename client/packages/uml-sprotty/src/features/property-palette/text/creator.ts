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
import { ElementTextPropertyItem } from "./model";

export interface TextPropertyEvents {
    onBlur?: (item: ElementTextPropertyItem, input: HTMLInputElement, event: FocusEvent) => void;
    onEnter?: (item: ElementTextPropertyItem, input: HTMLInputElement, event: KeyboardEvent) => void;
}

export function createTextProperty(propertyItem: ElementTextPropertyItem, events: TextPropertyEvents): CreatedElementProperty {
    const div = document.createElement("div");
    div.classList.add("property-item", "property-text-item");

    const label = document.createElement("label");
    label.classList.add("property-item-label");
    label.textContent = propertyItem.label;
    div.appendChild(label);

    const input = document.createElement("input");
    input.classList.add("property-item-full");
    input.type = "text";
    input.value = propertyItem.text ?? "";
    input.addEventListener("blur", ev => {
        events.onBlur?.(propertyItem, input, ev);
    });
    input.addEventListener("keypress", ev => {
        if (ev.key === "Enter") {
            ev.stopPropagation();
            events.onEnter?.(propertyItem, input, ev);
        }
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
