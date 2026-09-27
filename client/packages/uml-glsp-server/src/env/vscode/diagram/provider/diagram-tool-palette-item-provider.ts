/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Args, type MaybePromise, type PaletteItem, ToolPaletteItemProvider } from '@eclipse-glsp/server';
import { inject, injectable, multiInject } from 'inversify';
import { DiagramModelState } from '../../features/model/diagram-model-state.js';
import { DiagramServices, findDiagramServices } from '../../features/model/diagram-services.js';

/** The palette of whichever diagram is currently loaded. */
@injectable()
export class UmlDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @multiInject(DiagramServices)
    protected readonly diagramServices: DiagramServices[];

    override getItems(args?: Args): MaybePromise<PaletteItem[]> {
        return findDiagramServices(this.diagramServices, this.modelState.diagramType)?.toolPaletteItemProvider.getItems(args) ?? [];
    }
}
