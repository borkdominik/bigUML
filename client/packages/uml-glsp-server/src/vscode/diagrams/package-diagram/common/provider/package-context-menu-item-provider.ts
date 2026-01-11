/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractDiagramContextMenuItemProvider, type CreateNodeDescriptor } from '../../../../features/index.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class PackageDiagramContextMenuItemProvider extends AbstractDiagramContextMenuItemProvider<PackageDiagramModelState> {
    @inject(PackageDiagramModelState)
    readonly modelState!: PackageDiagramModelState;

    protected getCreateNodeDescriptors(): CreateNodeDescriptor[] {
        return [
            { id: 'newClass', label: 'Class', elementTypeId: ModelTypes.CLASS, icon: 'fa-class' }
            // Add more later if needed
        ];
    }
}
