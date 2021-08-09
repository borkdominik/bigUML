/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { ActionHandlerRegistry } from "@eclipse-glsp/client/lib";
import { GLSPTheiaDiagramServer } from "@eclipse-glsp/theia-integration/lib/browser";
import { GetTypesAction, ReturnTypesAction } from "@eclipsesource/uml-sprotty/lib/features/edit-label";
import { injectable } from "inversify";

@injectable()
export class UmlGLSPTheiaDiagramServer extends GLSPTheiaDiagramServer {
    initialize(registry: ActionHandlerRegistry): void {
        super.initialize(registry);

        registry.register(GetTypesAction.KIND, this);
        registry.register(ReturnTypesAction.KIND, this);
    }

}
