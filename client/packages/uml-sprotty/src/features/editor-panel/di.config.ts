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
import { configureActionHandler, TYPES } from "@eclipse-glsp/client";
import { ContainerModule } from "inversify";

import { EnableEditorPanelAction } from "./actions";
import { EditorPanel } from "./extension";

const umlEditorPanelModule = new ContainerModule(
    (bind, _unbind, isBound, rebind) => {
        const context = { bind, _unbind, isBound, rebind };

        bind(EditorPanel).toSelf().inSingletonScope();
        bind(TYPES.IUIExtension).toService(EditorPanel);

        configureActionHandler(
            context,
            EnableEditorPanelAction.KIND,
            EditorPanel
        );
    }
);

export default umlEditorPanelModule;