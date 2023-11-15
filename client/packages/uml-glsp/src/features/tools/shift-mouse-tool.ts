/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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
    BaseGLSPTool,
    BoundsAware,
    CursorCSS,
    DragAwareMouseListener,
    EnableDefaultToolsAction,
    PointPositionUpdater,
    SChildElement,
    SModelElement,
    SModelRoot,
    cursorFeedbackAction,
    forEachElement,
    getAbsolutePosition,
    isNonRoutableSelectedMovableBoundsAware,
    isSelectable,
    toAbsoluteBounds,
    toElementAndBounds
} from '@eclipse-glsp/client';
import { Action, ChangeBoundsOperation, ElementAndBounds, Operation, Point, SelectAction, SetBoundsAction } from '@eclipse-glsp/protocol';
import { inject, injectable, optional } from 'inversify';
import { TYPES } from '../../base/types';
import { RemoveHorizontalShiftAction } from '../tool-feedback/horizontal-shift-tool-feedback';
import { RemoveVerticalShiftAction } from '../tool-feedback/vertical-shift-tool-feedback';
import { IShiftBehavior, ShiftUtil } from './shift-behavior';

@injectable()
export class ShiftMouseTool extends BaseGLSPTool {
    static ID = 'glsp.shift-mouse-tool';

    @inject(TYPES.IShiftBehavior) @optional() protected shiftBehavior: IShiftBehavior;

    protected shiftElementsMouseListener: DragAwareMouseListener;

    get id(): string {
        return ShiftMouseTool.ID;
    }

    enable(): void {
        this.shiftElementsMouseListener = new ShiftElementsMouseListener(this.editorContext.modelRoot, this.shiftBehavior);
        this.mouseTool.register(this.shiftElementsMouseListener);
        this.dispatchFeedback([cursorFeedbackAction(CursorCSS.MOVE)]);
    }
    createChangeBoundsListener(): any {
        throw new Error('Method not implemented.');
    }

    disable(): void {
        this.mouseTool.deregister(this.shiftElementsMouseListener);
        this.deregisterFeedback([cursorFeedbackAction()]);
    }
}

export class ShiftElementsMouseListener extends DragAwareMouseListener {
    protected shiftUtil: ShiftUtil;
    protected elements: (SModelElement & BoundsAware)[];
    protected edges: SVGGElement[];
    protected previouslySelected: string[];
    protected isActive = false;

    protected startmouseDownPosition: Point;
    protected shiftOrientation: string;
    protected lastPosition: Point;
    protected pointPositionUpdater: PointPositionUpdater;
    protected initalTarget: SModelElement;

    constructor(root: SModelRoot, shiftBehavior: IShiftBehavior | undefined) {
        super();
        this.shiftUtil = new ShiftUtil(shiftBehavior);
        this.elements = Array.from(
            root.index
                .all()
                .map(e => e as SModelElement & BoundsAware)
                .filter(e => isSelectable(e))
        );
        this.pointPositionUpdater = new PointPositionUpdater();
    }

    override mouseDown(target: SModelElement, event: MouseEvent): Action[] {
        this.isActive = true;
        this.startmouseDownPosition = getAbsolutePosition(target, event);
        this.lastPosition = this.startmouseDownPosition;
        this.shiftUtil.updateStartPoint(this.startmouseDownPosition);
        this.initalTarget = target;
        return [SelectAction.create({ deselectedElementsIDs: this.elements.map(e => e.id) })];
    }

    override mouseMove(target: SModelElement, event: MouseEvent): Action[] {
        const actions: Action[] = [];
        if (this.isActive) {
            const newPosition = getAbsolutePosition(target, event);

            if (this.shiftOrientation === undefined) {
                const orientationMinimumDistance = 10;
                const positionDelta = Point.subtract(newPosition, this.startmouseDownPosition);
                if (Math.abs(Math.abs(positionDelta.x) - Math.abs(positionDelta.y)) > orientationMinimumDistance) {
                    if (Math.abs(positionDelta.x) > Math.abs(positionDelta.y)) {
                        this.shiftOrientation = 'horizontal';
                        const nodeIdsRight = this.elements
                            .filter(e => toAbsoluteBounds(e).x > this.startmouseDownPosition.x)
                            .map(e => e.id);
                        actions.push(SelectAction.create({ selectedElementsIDs: nodeIdsRight }));
                    } else {
                        this.shiftOrientation = 'vertical';
                        const nodeIdsBelow = this.elements
                            .filter(e => toAbsoluteBounds(e).y > this.startmouseDownPosition.y)
                            .map(e => e.id);
                        actions.push(SelectAction.create({ selectedElementsIDs: nodeIdsBelow }));
                    }
                }
            }

            this.shiftUtil.updateCurrentPoint(newPosition);

            if (this.shiftOrientation === 'horizontal') {
                let offset = Point.subtract(newPosition, this.lastPosition);
                offset = { x: offset.x, y: 0 };
                actions.push(this.shiftUtil.drawHorizontalShiftAction());
                actions.push(...this.handleMoveElementsOnClient(target, offset));
            } else if (this.shiftOrientation === 'vertical') {
                let offset = Point.subtract(newPosition, this.lastPosition);
                offset = { x: 0, y: offset.y };
                actions.push(this.shiftUtil.drawVerticalShiftAction());
                actions.push(...this.handleMoveElementsOnClient(target, offset));
            }
            this.lastPosition = newPosition;
        }
        return actions;
    }

    override mouseUp(target: SModelElement, event: MouseEvent): Action[] {
        this.isActive = false;
        const actions: Action[] = [
            RemoveVerticalShiftAction.create(),
            RemoveHorizontalShiftAction.create(),
            EnableDefaultToolsAction.create()
        ];
        actions.push(...this.handleMoveElementsOnServer(target));

        return actions;
    }

    protected handleMoveElementsOnServer(target: SModelElement): Operation[] {
        const result: Operation[] = [];
        const newBounds: ElementAndBounds[] = [];
        const selectedElements: (SModelElement & BoundsAware)[] = [];
        forEachElement(target.index, isNonRoutableSelectedMovableBoundsAware, element => {
            selectedElements.push(element);
        });
        const selectionSet: Set<SModelElement & BoundsAware> = new Set(selectedElements);

        selectedElements
            .filter(element => !this.isChildOfSelected(selectionSet, element))
            .map(element => [toElementAndBounds(element)])
            .forEach(bounds => newBounds.push(...bounds));
        if (newBounds.length > 0) {
            result.push(ChangeBoundsOperation.create(newBounds));
        }
        return result;
    }

    protected handleMoveElementsOnClient(target: SModelElement, offset: Point): Action[] {
        const result: Action[] = [];
        const newBounds: ElementAndBounds[] = [];
        const selectedElements: (SModelElement & BoundsAware)[] = [];

        forEachElement(target.index, isNonRoutableSelectedMovableBoundsAware, element => {
            selectedElements.push(element);
        });

        const selectionSet: Set<SModelElement & BoundsAware> = new Set(selectedElements);

        selectedElements
            .filter(element => !this.isChildOfSelected(selectionSet, element))
            .map(element => [toElementAndBounds(element)])
            .forEach(bounds => newBounds.push(...bounds));
        newBounds.map(b => (b.newPosition === undefined ? null : (b.newPosition = Point.add(b.newPosition, offset))));

        if (newBounds.length > 0) {
            result.push(SetBoundsAction.create(newBounds));
        }
        return result;
    }

    // copy from change-bounds-tool
    protected isChildOfSelected(selectedElements: Set<SModelElement>, element: SModelElement): boolean {
        while (element instanceof SChildElement) {
            element = element.parent;
            if (selectedElements.has(element)) {
                return true;
            }
        }
        return false;
    }
}
