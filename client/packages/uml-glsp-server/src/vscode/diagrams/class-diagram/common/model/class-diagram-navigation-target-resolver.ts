/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractByNameNavigationTargetResolver } from '../../../../common/model/base-navigation-target-resolver.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class ClassDiagramNavigationTargetResolver extends AbstractByNameNavigationTargetResolver<GClassNode> {
    @inject(ClassDiagramModelState)
    override readonly modelState!: ClassDiagramModelState;

    protected readonly nodeCtor = GClassNode;
}
