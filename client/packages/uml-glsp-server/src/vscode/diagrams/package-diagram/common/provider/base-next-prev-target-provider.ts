/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractNextOrPreviousNavigationTargetProvider } from '../../../../common/provider/next-prev-target-provider.js';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export abstract class PackageDiagramNextPrevProviderBase extends AbstractNextOrPreviousNavigationTargetProvider<GPackageClassNode> {
    @inject(PackageDiagramModelState)
    override readonly modelState!: PackageDiagramModelState;

    protected readonly nodeCtor = GPackageClassNode;
}

@injectable()
export class PackageDiagramNextNodeNavigationTargetProvider extends PackageDiagramNextPrevProviderBase {
    readonly targetTypeId = 'next' as const;
    protected readonly direction = 'next' as const;
}

@injectable()
export class PackageDiagramPreviousNodeNavigationTargetProvider extends PackageDiagramNextPrevProviderBase {
    readonly targetTypeId = 'previous' as const;
    protected readonly direction = 'previous' as const;
}
