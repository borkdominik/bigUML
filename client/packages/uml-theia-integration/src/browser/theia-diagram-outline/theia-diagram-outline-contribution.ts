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
import { IActionDispatcher, ModelSource, TYPES } from '@eclipse-glsp/client';
import { DiagramOutlineService } from '@eclipsesource/uml-sprotty/lib/features/diagram-outline';
import { Container } from '@theia/core/shared/inversify';

import { TheiaDiagramOutlineService } from './theia-diagram-outline-service';

export function connectTheiaDiagramOutlineView(
    container: Container,
    theiaDiagramOutlineServiceFactory: () => TheiaDiagramOutlineService
): void {
    const theiaDiagramOutlineService = theiaDiagramOutlineServiceFactory();
    container.bind(DiagramOutlineService).toConstantValue(theiaDiagramOutlineService);
    container.bind(TheiaDiagramOutlineService).toConstantValue(theiaDiagramOutlineService);
    container.bind(TYPES.SModelRootListener).toConstantValue(theiaDiagramOutlineService);

    if (theiaDiagramOutlineService instanceof DiagramOutlineService) {
        theiaDiagramOutlineService.connect(
            container.get<ModelSource>(TYPES.ModelSource),
            container.get<IActionDispatcher>(TYPES.IActionDispatcher)
        );
    }
}
