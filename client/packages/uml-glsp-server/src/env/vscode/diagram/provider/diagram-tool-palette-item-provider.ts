/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Args, type MaybePromise, type PaletteItem, ToolPaletteItemProvider } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ClassDiagramToolPaletteItemProvider } from '../../../../gen/vscode/index.js';

@injectable()
export class UmlDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    @inject(ClassDiagramToolPaletteItemProvider)
    protected readonly classDiagramToolPaletteItemProvider: ClassDiagramToolPaletteItemProvider;

    override getItems(args?: Args): MaybePromise<PaletteItem[]> {
        return this.classDiagramToolPaletteItemProvider.getItems(args);
    }
}
