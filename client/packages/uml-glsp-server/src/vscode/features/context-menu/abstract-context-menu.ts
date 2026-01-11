/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Args, ContextMenuItemProvider, CreateNodeOperation, type MenuItem, type Point } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { GridSnapper } from '../../features/grid/grid-snapper.js';
import { type BaseDiagramModelState } from '../../features/model/base-diagram-model-state.js';

export interface CreateNodeDescriptor {
    id: string;
    label: string;
    elementTypeId: string;
    icon?: string;
}

@injectable()
export abstract class AbstractDiagramContextMenuItemProvider<StateT extends BaseDiagramModelState> extends ContextMenuItemProvider {
    abstract readonly modelState: StateT;

    protected abstract getCreateNodeDescriptors(): CreateNodeDescriptor[];

    protected shouldShowForSelection(selectedElementIds: string[], _args?: Args): boolean {
        return selectedElementIds.length === 0;
    }

    protected getRootMenuId(): string {
        return 'new';
    }
    protected getRootMenuLabel(): string {
        return 'New';
    }
    protected getRootMenuIcon(): string {
        return 'add';
    }
    protected getRootMenuGroup(): string {
        return '0_new';
    }

    getItems(selectedElementIds: string[], position: Point, args?: Args): MenuItem[] {
        if (this.modelState.isReadonly || !this.shouldShowForSelection(selectedElementIds, args)) {
            return [];
        }

        const snapped = GridSnapper.snap(position);
        const children: MenuItem[] = this.getCreateNodeDescriptors().map(d => ({
            id: d.id,
            label: d.label,
            actions: [CreateNodeOperation.create(d.elementTypeId, { location: snapped })],
            icon: d.icon ?? 'fa-class'
        }));

        if (children.length === 0) {
            return [];
        }

        const root: MenuItem = {
            id: this.getRootMenuId(),
            label: this.getRootMenuLabel(),
            actions: [],
            children,
            icon: this.getRootMenuIcon(),
            group: this.getRootMenuGroup()
        };

        return [root];
    }
}
