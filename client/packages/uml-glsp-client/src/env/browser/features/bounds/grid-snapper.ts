/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import {
    Action,
    GetViewportAction,
    type GLSPActionDispatcher,
    type GModelElement,
    GNode,
    GResizeHandle,
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
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';

/** The partition, whose lanes are snapped against one another - see `UmlGridSnapper.snapToLane`. */
const ACTIVITY_PARTITION_TYPE = representationTypeId('Activity', DefaultTypes.NODE, 'ActivityPartition');

/** An edge taken to a neighbour's, kept with its distance so the nearest of several candidates wins. */
interface SnappedAxis {
    value: number;
    distance: number;
}

/** Each axis independently: one may find a neighbour to snap to while the other falls back to the grid. */
interface SnappedAxes {
    x?: SnappedAxis;
    y?: SnappedAxis;
}

@injectable()
export class UmlGridSnapper implements ISnapper {
    static GRID_X = 10;
    static GRID_Y = 10;
    static CSS_FACTOR = 5;

    /**
     * How near an edge has to be dragged before it is taken to a neighbouring lane's. Wider than the grid
     * step, or the grid would round a lane past the very edge it is being brought to.
     */
    static LANE_SNAP_DISTANCE = 15;

    constructor(public grid: { x: number; y: number } = { x: UmlGridSnapper.GRID_X, y: UmlGridSnapper.GRID_Y }) {}

    snap(position: Point, element: GModelElement): Point {
        return this.snapToLane(position, element) ?? this.snapToGrid(position);
    }

    protected snapToGrid(position: Point): Point {
        return {
            x: Math.round(position.x / this.grid.x) * this.grid.x,
            y: Math.round(position.y / this.grid.y) * this.grid.y
        };
    }

    /**
     * A partition snapped against its neighbours, because a swimlane is a set of lanes sharing their edges
     * rather than a set of bands that merely sit near each other.
     *
     * Both dragging the lane and dragging one of its handles come through here: the change-bounds tracker
     * snaps a resize by snapping the handle's own move, so on a resize the element is a `GResizeHandle` and
     * the position is the edge being dragged, while on a move it is the lane and its top left corner.
     *
     * Only the axes that found a neighbour are taken; the rest falls back to the grid. Returns `undefined`
     * when nothing being dragged is a lane, or when no lane is near enough, so everything else snaps as
     * before.
     */
    protected snapToLane(position: Point, element: GModelElement): Point | undefined {
        const handle = element instanceof GResizeHandle ? element : undefined;
        const lane = handle ? handle.parent : element;
        if (!(lane instanceof GNode) || lane.type !== ACTIVITY_PARTITION_TYPE) {
            return undefined;
        }

        const neighbours = lane.parent.children.filter(
            (child): child is GNode => child !== lane && child instanceof GNode && child.type === ACTIVITY_PARTITION_TYPE
        );
        if (neighbours.length === 0) {
            return undefined;
        }

        const snapped = handle
            ? this.snapLaneEdge(position, handle, neighbours)
            : this.snapLaneCorner(position, lane, neighbours);
        if (!snapped.x && !snapped.y) {
            return undefined;
        }

        const grid = this.snapToGrid(position);
        return { x: snapped.x?.value ?? grid.x, y: snapped.y?.value ?? grid.y };
    }

    /** The lane itself is being moved, so `position` is where its top left corner would land. */
    protected snapLaneCorner(position: Point, lane: GNode, neighbours: GNode[]): SnappedAxes {
        const snapped: SnappedAxes = {};
        for (const neighbour of neighbours) {
            // Leading edges in one column, which is what keeps the name band of every lane aligned.
            snapped.x = this.nearer(snapped.x, neighbour.bounds.x, position.x);
            // Under the neighbour, and over it.
            snapped.y = this.nearer(snapped.y, neighbour.bounds.y + neighbour.bounds.height, position.y);
            snapped.y = this.nearer(snapped.y, neighbour.bounds.y - lane.bounds.height, position.y);
        }
        return snapped;
    }

    /**
     * One edge of the lane is being dragged, so `position` is where that edge would land - and only the
     * axes the handle actually governs are snapped. A handle on an edge rather than a corner reports the
     * middle of that edge for the other axis, which is not an edge of anything and must not be taken for
     * one.
     */
    protected snapLaneEdge(position: Point, handle: GResizeHandle, neighbours: GNode[]): SnappedAxes {
        const location = handle.location;
        const movesTop = location.includes('top');
        const movesBottom = location.includes('bottom');
        const movesLeft = location.includes('left');
        const movesRight = location.includes('right');

        const snapped: SnappedAxes = {};
        for (const neighbour of neighbours) {
            const { x, y, width, height } = neighbour.bounds;
            // A lane's top meets the underside of the one above it, its bottom the top of the one below.
            if (movesTop) {
                snapped.y = this.nearer(snapped.y, y + height, position.y);
            }
            if (movesBottom) {
                snapped.y = this.nearer(snapped.y, y, position.y);
            }
            // Sideways, either edge may be brought to either of a neighbour's: to the same edge, so the
            // lanes end in one column, or to the opposite one, so they stand flush side by side.
            if (movesLeft || movesRight) {
                snapped.x = this.nearer(snapped.x, x, position.x);
                snapped.x = this.nearer(snapped.x, x + width, position.x);
            }
        }
        return snapped;
    }

    /** The candidate nearer to where the edge actually is, provided it is near enough to take at all. */
    protected nearer(best: SnappedAxis | undefined, candidate: number, actual: number): SnappedAxis | undefined {
        const distance = Math.abs(candidate - actual);
        if (distance > UmlGridSnapper.LANE_SNAP_DISTANCE || (best && best.distance <= distance)) {
            return best;
        }
        return { value: candidate, distance };
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

                const newPosX = (-viewport.scroll.x + UmlGridSnapper.CSS_FACTOR * UmlGridSnapper.GRID_X) * viewport.zoom;
                const newPosY = (-viewport.scroll.y + UmlGridSnapper.CSS_FACTOR * UmlGridSnapper.GRID_Y) * viewport.zoom;
                graph.style.backgroundPosition = `${newPosX}px ${newPosY}px`;

                const newSize = UmlGridSnapper.CSS_FACTOR * UmlGridSnapper.GRID_X * 2 * viewport.zoom;
                graph.style.backgroundSize = `${newSize}px ${newSize}px`;
            }
        }
    }
}
