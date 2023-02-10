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
import { ElementChoicePropertyItem } from "./model";

export interface ChoicePropertyEvents {
    onChange?: (item: ElementChoicePropertyItem, input: HTMLSelectElement, event: Event) => void;
}

export function createChoiceProperty(propertyItem: ElementChoicePropertyItem, events: ChoicePropertyEvents): CreatedElementProperty {
    const div = document.createElement("div");
    div.classList.add("property-item", "property-choice-item");

    const label = document.createElement("label");
    label.textContent = propertyItem.label;
    div.appendChild(label);

    const select = document.createElement("select");

    propertyItem.choices.forEach(choice => {
        const option = document.createElement("option");

        option.text = choice.label;
        option.value = choice.value;

        if (option.value === propertyItem.choice) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    select.addEventListener("change", ev => {
        events.onChange?.(propertyItem, select, ev);
    });
    div.appendChild(select);

    return {
        element: div,
        ui: {
            disable: () => {
                select.disabled = true;
            },
            enable: () => {
                select.disabled = false;
            }
        }
    };
}
