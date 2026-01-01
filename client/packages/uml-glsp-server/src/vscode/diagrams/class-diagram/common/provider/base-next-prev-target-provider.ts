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
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export abstract class ClassDiagramNextPrevProviderBase extends AbstractNextOrPreviousNavigationTargetProvider<GClassNode> {
    @inject(ClassDiagramModelState)
    override readonly modelState!: ClassDiagramModelState;

    protected readonly nodeCtor = GClassNode;
}

@injectable()
export class ClassDiagramNextNodeNavigationTargetProvider extends ClassDiagramNextPrevProviderBase {
    readonly targetTypeId = 'next' as const;
    protected readonly direction = 'next' as const;
}

@injectable()
export class ClassDiagramPreviousNodeNavigationTargetProvider extends ClassDiagramNextPrevProviderBase {
    readonly targetTypeId = 'previous' as const;
    protected readonly direction = 'previous' as const;
}
