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
import { compare, createToolGroup, PaletteItem, ToolPalette } from "@eclipse-glsp/client";
import { injectable } from "inversify";

@injectable()
export class UmlToolPalette extends ToolPalette {

    protected createBody(): void {
        const bodyDiv = document.createElement("div");
        bodyDiv.classList.add("palette-body");
        let tabIndex = 0;
        this.paletteItems.sort(compare)
            .forEach(item => {
                if (item.children) {
                    const group = createToolGroup(item);
                    item.children.sort(compare).forEach(child => group.appendChild(this.createUmlToolButton(child, tabIndex++, child.icon || "")));
                    bodyDiv.appendChild(group);
                } else {
                    bodyDiv.appendChild(this.createUmlToolButton(item, tabIndex++, item.icon || "umlclass"));
                }
            });
        if (this.paletteItems.length === 0) {
            const noResultsDiv = document.createElement("div");
            noResultsDiv.innerText = "No results found.";
            noResultsDiv.classList.add("tool-button");
            bodyDiv.appendChild(noResultsDiv);
        }
        // Remove existing body to refresh filtered entries
        if (this.bodyDiv) {
            this.containerElement.removeChild(this.bodyDiv);
        }
        this.containerElement.appendChild(bodyDiv);
        this.bodyDiv = bodyDiv;
    }

    protected createUmlToolButton(item: PaletteItem, index: number, icon: string): HTMLElement {
        const button = document.createElement("div");
        button.appendChild(this.createUmlIcon(icon));
        button.tabIndex = index;
        button.classList.add("tool-button");
        button.classList.add("uml-tool-button");
        button.insertAdjacentText("beforeend", item.label);
        button.onclick = super.onClickCreateToolButton(button, item);
        button.onkeydown = ev => this.clearToolOnEscape(ev);
        return button;
    }

    protected createUmlIcon(cssClass: string): HTMLDivElement {
        const icon = document.createElement("div");
        icon.classList.add(...["umlimg", cssClass]);
        return icon;
    }

}
