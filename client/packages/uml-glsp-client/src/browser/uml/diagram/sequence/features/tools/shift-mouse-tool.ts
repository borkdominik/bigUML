/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    BaseEditTool,
    type BoundsAware,
    CursorCSS,
    cursorFeedbackAction,
    DragAwareMouseListener,
    EnableDefaultToolsAction,
    forEachElement,
    GChildElement,
    getAbsolutePosition,
    type GModelElement,
    type GModelRoot,
    isNonRoutableSelectedMovableBoundsAware,
    isSelectable,
    PointPositionUpdater,
    toAbsoluteBounds,
    toElementAndBounds
} from '@eclipse-glsp/client';
import { type Action, ChangeBoundsOperation, type ElementAndBounds, type Operation, Point, SelectAction, SetBoundsAction } from '@eclipse-glsp/protocol';
import { inject, injectable, optional } from 'inversify';
import { UML_TYPES } from '../../../../../uml-glsp.types.js';
import { SDRemoveHorizontalShiftAction } from '../tool-feedback/horizontal-shift-tool-feedback.js';
import { SDRemoveVerticalShiftAction } from '../tool-feedback/vertical-shift-tool-feedback.js';
import { type SDIShiftBehavior, SDShiftUtil } from './shift-behavior.js';

// TODO: Sequence Diagram Specific
@injectable()
export class SDShiftMouseTool extends BaseEditTool {
    static ID = 'glsp.shift-mouse-tool';

    @inject(UML_TYPES.IShiftBehavior) @optional() protected shiftBehavior: SDIShiftBehavior;

    protected shiftElementsMouseListener: DragAwareMouseListener;

    get id(): string {
        return SDShiftMouseTool.ID;
    }

    protected createShiftElementsMouseListener(): DragAwareMouseListener {
        return new SDShiftElementsMouseListener(this.editorContext.modelRoot, this.shiftBehavior);
    }

    enable(): void {
        this.toDisposeOnDisable.push(
            this.mouseTool.registerListener(this.createShiftElementsMouseListener()),
            this.registerFeedback([cursorFeedbackAction(CursorCSS.MOVE)], this, [cursorFeedbackAction()])
        );
    }
}

export class SDShiftElementsMouseListener extends DragAwareMouseListener {
    protected shiftUtil: SDShiftUtil;
    protected elements: (GModelElement & BoundsAware)[];
    protected edges: SVGGElement[];
    protected previouslySelected: string[];
    protected isActive = false;

    protected startmouseDownPosition: Point;
    protected shiftOrientation: string;
    protected lastPosition: Point;
    protected pointPositionUpdater: PointPositionUpdater;
    protected initalTarget: GModelElement;

    constructor(root: GModelRoot, shiftBehavior: SDIShiftBehavior | undefined) {
        super();
        this.shiftUtil = new SDShiftUtil(shiftBehavior);
        this.elements = Array.from(
            root.index
                .all()
                .map(e => e as GModelElement & BoundsAware)
                .filter(e => isSelectable(e))
        );
        this.pointPositionUpdater = new PointPositionUpdater();
    }

    override mouseDown(target: GModelElement, event: MouseEvent): Action[] {
        this.isActive = true;
        this.startmouseDownPosition = getAbsolutePosition(target, event);
        this.lastPosition = this.startmouseDownPosition;
        this.shiftUtil.updateStartPoint(this.startmouseDownPosition);
        this.initalTarget = target;
        return [SelectAction.create({ deselectedElementsIDs: this.elements.map(e => e.id) })];
    }

    override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
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

    override mouseUp(target: GModelElement, _event: MouseEvent): Action[] {
        this.isActive = false;
        const actions: Action[] = [
            SDRemoveVerticalShiftAction.create(),
            SDRemoveHorizontalShiftAction.create(),
            EnableDefaultToolsAction.create()
        ];
        actions.push(...this.handleMoveElementsOnServer(target));

        return actions;
    }

    protected handleMoveElementsOnServer(target: GModelElement): Operation[] {
        const result: Operation[] = [];
        const newBounds: ElementAndBounds[] = [];
        const selectedElements: (GModelElement & BoundsAware)[] = [];
        forEachElement(target.index, isNonRoutableSelectedMovableBoundsAware, element => {
            selectedElements.push(element);
        });
        const selectionSet: Set<GModelElement & BoundsAware> = new Set(selectedElements);

        selectedElements
            .filter(element => !this.isChildOfSelected(selectionSet, element))
            .map(element => [toElementAndBounds(element)])
            .forEach(bounds => newBounds.push(...bounds));
        if (newBounds.length > 0) {
            result.push(ChangeBoundsOperation.create(newBounds));
        }
        return result;
    }

    protected handleMoveElementsOnClient(target: GModelElement, offset: Point): Action[] {
        const result: Action[] = [];
        const newBounds: ElementAndBounds[] = [];
        const selectedElements: (GModelElement & BoundsAware)[] = [];

        forEachElement(target.index, isNonRoutableSelectedMovableBoundsAware, element => {
            selectedElements.push(element);
        });

        const selectionSet: Set<GModelElement & BoundsAware> = new Set(selectedElements);

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
    protected isChildOfSelected(selectedElements: Set<GModelElement>, element: GModelElement): boolean {
        while (element instanceof GChildElement) {
            element = element.parent;
            if (selectedElements.has(element)) {
                return true;
            }
        }
        return false;
    }
}
