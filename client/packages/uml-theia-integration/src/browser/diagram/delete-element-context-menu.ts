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
import { EditorContextService, EditorContextServiceProvider } from "@eclipse-glsp/client/lib/base/editor-context";
import { DeleteElementOperation } from "@eclipse-glsp/client/lib/base/operations/operation";
import { GLSP_TYPES } from "@eclipse-glsp/client/lib/base/types";
import { inject, injectable } from "inversify";
import { IContextMenuItemProvider, MenuItem, Point, SModelRoot } from "sprotty";

@injectable()
export class DeleteElementContextMenuItemProvider implements IContextMenuItemProvider {
    @inject(GLSP_TYPES.IEditorContextServiceProvider) editorContextServiceProvider: EditorContextServiceProvider;

    async getItems(_root: Readonly<SModelRoot>, _lastMousePosition?: Point): Promise<MenuItem[]> {
        const editorContextService = await this.editorContextServiceProvider();
        return [this.createDeleteMenuItem(editorContextService)];
    }

    protected createDeleteMenuItem(editorContextService: EditorContextService): MenuItem {
        return {
            id: "delete",
            label: "Delete",
            sortString: "d",
            group: "edit",
            actions: [new DeleteElementOperation(editorContextService.selectedElements.map(e => e.id))],
            isEnabled: () => !editorContextService.isReadonly && editorContextService.selectedElements.length > 0
        };
    }
}
