/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
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
import { IActionDispatcher, GLSP_TYPES, TYPES } from "@eclipse-glsp/client";
import { DiagramOutlineViewService } from "@eclipsesource/uml-sprotty/lib/features/diagram-outline-view/diagram-outline-view-service";
import { Container } from "@theia/core/shared/inversify";

export function connectTheiaDiagramOutlineView(
    container: Container,
    diagramOutlineViewServiceFactory: () => DiagramOutlineViewService
): void {
    const diagramOutlineViewService = diagramOutlineViewServiceFactory();
    container.bind(DiagramOutlineViewService).toConstantValue(diagramOutlineViewService);
    container.bind(GLSP_TYPES.SModelRootListener).toConstantValue(diagramOutlineViewService);

    if (diagramOutlineViewService instanceof DiagramOutlineViewService) {
        diagramOutlineViewService.connect(container.get<IActionDispatcher>(TYPES.IActionDispatcher));
    }
}
