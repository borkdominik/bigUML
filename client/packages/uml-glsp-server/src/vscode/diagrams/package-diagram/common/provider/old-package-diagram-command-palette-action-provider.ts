/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
import {
    type Args,
    CommandPaletteActionProvider,
    CreateEdgeOperation,
    CreateNodeOperation,
    DefaultTypes,
    DeleteElementOperation,
    type GModelElement,
    GNode,
    type LabeledAction,
    Point
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { PackageDiagramModelIndex } from '../../model/package-diagram-model-index.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class PackageDiagramCommandPaletteActionProvider extends CommandPaletteActionProvider {
    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;

    @inject(PackageDiagramModelIndex)
    protected modelIndex: PackageDiagramModelIndex;

    getPaletteActions(selectedElementIds: string[], selectedElements: GModelElement[], position: Point, _args?: Args): LabeledAction[] {
        const actions: LabeledAction[] = [];
        if (this.modelState.isReadonly) {
            return actions;
        }
        const index = this.modelState.index;
        // Create actions
        const location = position ?? Point.ORIGIN;
        // Create general actions
        actions.push({
            label: 'Create Class',
            actions: [CreateNodeOperation.create(ModelTypes.CLASS, { location })],
            icon: 'fa-plus-square'
        });
        actions.push({
            label: 'Create Package',
            actions: [CreateNodeOperation.create(ModelTypes.PACKAGE, { location })],
            icon: 'fa-plus-square'
        });
        // Create edge action between two nodes
        if (selectedElements.length === 1) {
            const element = selectedElements[0];
            if (element instanceof GNode) {
                actions.push(...this.createEdgeActions(element, index.getAllByClass(GPackageClassNode)));
            }
        } else if (selectedElements.length === 2) {
            const source = selectedElements[0];
            const target = selectedElements[1];
            if (source instanceof GPackageClassNode && target instanceof GPackageClassNode) {
                actions.push(
                    this.createEdgeAction(`Create Edge from ${this.getLabel(source)} to ${this.getLabel(target)}`, source, target)
                );
            }
        }
        // Delete action
        const label = selectedElementIds.length === 1 ? 'Delete' : 'Delete All';
        actions.push({
            label,
            actions: [DeleteElementOperation.create(selectedElementIds)],
            icon: 'fa-minus-square'
        });

        return actions;
    }

    protected createEdgeActions(source: GNode, targets: GNode[]): LabeledAction[] {
        const actions: LabeledAction[] = [];
        targets.forEach(node => actions.push(this.createEdgeAction(`Create Edge to ${this.getLabel(node)}`, source, node)));
        return actions;
    }

    protected createEdgeAction(label: string, source: GNode, node: GNode): LabeledAction {
        return {
            label,
            actions: [
                CreateEdgeOperation.create({
                    elementTypeId: DefaultTypes.EDGE,
                    sourceElementId: source.id,
                    targetElementId: node.id
                })
            ],
            icon: 'fa-plus-square'
        };
    }

    protected getLabel(node: GNode): string {
        return node.id;
    }
}
