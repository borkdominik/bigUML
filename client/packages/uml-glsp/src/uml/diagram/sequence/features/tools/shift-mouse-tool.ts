/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    BaseGLSPTool,
    BoundsAware,
    CursorCSS,
    cursorFeedbackAction,
    DragAwareMouseListener,
    EnableDefaultToolsAction,
    forEachElement,
    getAbsolutePosition,
    isNonRoutableSelectedMovableBoundsAware,
    isSelectable,
    PointPositionUpdater,
    SChildElement,
    SModelElement,
    SModelRoot,
    toAbsoluteBounds,
    toElementAndBounds
} from '@eclipse-glsp/client';
import { Action, ChangeBoundsOperation, ElementAndBounds, Operation, Point, SelectAction, SetBoundsAction } from '@eclipse-glsp/protocol';
import { inject, injectable, optional } from 'inversify';
import { UML_TYPES } from '../../../../../di.types';
import { SDRemoveHorizontalShiftAction } from '../tool-feedback/horizontal-shift-tool-feedback';
import { SDRemoveVerticalShiftAction } from '../tool-feedback/vertical-shift-tool-feedback';
import { SDIShiftBehavior, SDShiftUtil } from './shift-behavior';

// TODO: Sequence Diagram Specific
@injectable()
export class SDShiftMouseTool extends BaseGLSPTool {
    static ID = 'glsp.shift-mouse-tool';

    @inject(UML_TYPES.IShiftBehavior) @optional() protected shiftBehavior: SDIShiftBehavior;

    protected shiftElementsMouseListener: DragAwareMouseListener;

    get id(): string {
        return SDShiftMouseTool.ID;
    }

    enable(): void {
        this.shiftElementsMouseListener = new SDShiftElementsMouseListener(this.editorContext.modelRoot, this.shiftBehavior);
        this.mouseTool.register(this.shiftElementsMouseListener);
        this.dispatchFeedback([cursorFeedbackAction(CursorCSS.MOVE)]);
    }

    disable(): void {
        this.mouseTool.deregister(this.shiftElementsMouseListener);
        this.deregisterFeedback([cursorFeedbackAction()]);
    }
}

export class SDShiftElementsMouseListener extends DragAwareMouseListener {
    protected shiftUtil: SDShiftUtil;
    protected elements: (SModelElement & BoundsAware)[];
    protected edges: SVGGElement[];
    protected previouslySelected: string[];
    protected isActive = false;

    protected startmouseDownPosition: Point;
    protected shiftOrientation: string;
    protected lastPosition: Point;
    protected pointPositionUpdater: PointPositionUpdater;
    protected initalTarget: SModelElement;

    constructor(root: SModelRoot, shiftBehavior: SDIShiftBehavior | undefined) {
        super();
        this.shiftUtil = new SDShiftUtil(shiftBehavior);
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
            SDRemoveVerticalShiftAction.create(),
            SDRemoveHorizontalShiftAction.create(),
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
