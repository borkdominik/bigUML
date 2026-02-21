/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { CreateNodeOperation, type LabeledAction, type Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { AbstractDiagramCommandPaletteActionProvider } from '../../../../features/index.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.element.js';

// TODO: Remove
@injectable()
export class ClassDiagramCommandPaletteActionProvider extends AbstractDiagramCommandPaletteActionProvider<
    GClassNode,
    ClassDiagramModelState
> {
    @inject(ClassDiagramModelState)
    override readonly modelState!: ClassDiagramModelState;

    protected readonly nodeCtor = GClassNode;

    protected getGeneralCreateNodeActions(location: Point): LabeledAction[] {
        return [
            {
                label: 'Create Class',
                actions: [CreateNodeOperation.create(ClassDiagramNodeTypes.CLASS, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Abstract Class',
                actions: [CreateNodeOperation.create(ClassDiagramNodeTypes.ABSTRACT_CLASS, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Property',
                actions: [CreateNodeOperation.create(ClassDiagramNodeTypes.PROPERTY, { location })],
                icon: 'fa-plus-square'
            }
        ];
    }
}
