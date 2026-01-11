/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractByNameNavigationTargetResolver } from '../../../../features/index.js';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageDiagramNavigationTargetResolver extends AbstractByNameNavigationTargetResolver<GPackageClassNode> {
    @inject(PackageDiagramModelState)
    override readonly modelState!: PackageDiagramModelState;

    protected readonly nodeCtor = GPackageClassNode;
}
