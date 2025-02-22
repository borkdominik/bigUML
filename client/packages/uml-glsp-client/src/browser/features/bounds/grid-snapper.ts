/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    Action,
    GetViewportAction,
    type GLSPActionDispatcher,
    type GModelElement,
    hasBooleanProp,
    type IActionHandler,
    type IDiagramStartup,
    type ISnapper,
    type Point,
    SetViewportAction,
    TYPES,
    type ViewerOptions,
    type Viewport,
    type ViewportResult
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

@injectable()
export class UMLGridSnapper implements ISnapper {
    static GRID_X = 10;
    static GRID_Y = 10;
    static CSS_FACTOR = 5;

    constructor(public grid: { x: number; y: number } = { x: UMLGridSnapper.GRID_X, y: UMLGridSnapper.GRID_Y }) {}

    snap(position: Point, _element: GModelElement): Point {
        return {
            x: Math.round(position.x / this.grid.x) * this.grid.x,
            y: Math.round(position.y / this.grid.y) * this.grid.y
        };
    }
}

export interface ShowGridAction extends Action {
    kind: typeof ShowGridAction.KIND;
    visibility: boolean;
}

export namespace ShowGridAction {
    export const KIND = 'showGridAction';

    export function is(object: any): object is ShowGridAction {
        return Action.hasKind(object, KIND) && hasBooleanProp(object, 'show');
    }

    export function create(options: { visibility: boolean }): ShowGridAction {
        return {
            kind: KIND,
            ...options
        };
    }
}

@injectable()
export class GraphGridActionHandler implements IActionHandler, IDiagramStartup {
    static ZOOM_HIDE_THRESHOLD = 0.4;
    static CSS_CLASS = 'graph-grid';
    static ENABLED = false;

    @inject(TYPES.ViewerOptions) protected options: ViewerOptions;
    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: GLSPActionDispatcher;

    get isVisible(): boolean {
        const graph = document.querySelector(`#${this.options.baseDiv} .sprotty-graph`) as HTMLElement;
        return graph.classList.contains(GraphGridActionHandler.CSS_CLASS);
    }

    handle(action: Action): Action | void {
        if (GraphGridActionHandler.ENABLED) {
            if (ShowGridAction.is(action)) {
                this.showGrid(action.visibility);
            } else if (SetViewportAction.is(action)) {
                this.moveGrid(action.newViewport);
            }
        }
    }

    postModelInitialization(): void {
        if (GraphGridActionHandler.ENABLED) {
            this.actionDispatcher.requestUntil<ViewportResult>(GetViewportAction.create()).then(result => {
                this.showGrid(true);
                this.moveGrid(result!.viewport);
            });
        }
    }

    protected showGrid(visibility: boolean): void {
        const graph = document.querySelector(`#${this.options.baseDiv} .sprotty-graph`) as HTMLElement;

        if (visibility) {
            graph.classList.add(GraphGridActionHandler.CSS_CLASS);
        } else {
            graph.classList.remove(GraphGridActionHandler.CSS_CLASS);
        }
    }

    protected moveGrid(viewport: Viewport): void {
        const graph = document.querySelector(`#${this.options.baseDiv} .sprotty-graph`) as HTMLElement;
        if (graph) {
            if (viewport.zoom < GraphGridActionHandler.ZOOM_HIDE_THRESHOLD) {
                this.showGrid(false);
            } else {
                if (!this.isVisible) {
                    this.showGrid(true);
                }

                const newPosX = (-viewport.scroll.x + UMLGridSnapper.CSS_FACTOR * UMLGridSnapper.GRID_X) * viewport.zoom;
                const newPosY = (-viewport.scroll.y + UMLGridSnapper.CSS_FACTOR * UMLGridSnapper.GRID_Y) * viewport.zoom;
                graph.style.backgroundPosition = `${newPosX}px ${newPosY}px`;

                const newSize = UMLGridSnapper.CSS_FACTOR * UMLGridSnapper.GRID_X * 2 * viewport.zoom;
                graph.style.backgroundSize = `${newSize}px ${newSize}px`;
            }
        }
    }
}
