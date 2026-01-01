/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CreateNodeOperation, type LabeledAction, type Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { AbstractDiagramCommandPaletteActionProvider } from '../../../../common/provider/abstract-diagram-command-palette.js';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class PackageDiagramCommandPaletteActionProvider extends AbstractDiagramCommandPaletteActionProvider<
    GPackageClassNode,
    PackageDiagramModelState
> {
    @inject(PackageDiagramModelState)
    override readonly modelState!: PackageDiagramModelState;

    protected readonly nodeCtor = GPackageClassNode;

    protected getGeneralCreateNodeActions(location: Point): LabeledAction[] {
        return [
            {
                label: 'Create Class',
                actions: [CreateNodeOperation.create(ModelTypes.CLASS, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Package',
                actions: [CreateNodeOperation.create(ModelTypes.PACKAGE, { location })],
                icon: 'fa-plus-square'
            }
        ];
    }
}
