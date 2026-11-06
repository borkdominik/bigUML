/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    FeedbackMoveMouseListener,
    findParentByFeature,
    type GModelElement,
    isResizable,
    isSelectable,
    type ResizableModelElement
} from '@eclipse-glsp/client';
import { ChangeBoundsListener, ChangeBoundsTool } from '@eclipse-glsp/client/lib/features/tools/change-bounds/change-bounds-tool.js';
import { injectable } from 'inversify';
import { isRelationHandle } from '../tools/relation-creation/relation-handle.js';

/**
 * Puts resize handles only on the element that is actually selected.
 *
 * GLSP looks for the nearest resizable ancestor of whatever was clicked. A member that cannot be resized
 * itself - an operation, a property - is selected on its own, but that lookup walks past it to the class
 * it sits in, which then shows handles and can be dragged bigger although it is not the selection.
 */
export class UmlChangeBoundsListener extends ChangeBoundsListener {
    protected override findResizeElement(target: GModelElement): ResizableModelElement | undefined {
        const selectable = findParentByFeature(target, isSelectable);
        return selectable && isResizable(selectable) ? selectable : undefined;
    }
}

/**
 * Leaves a press on a relation arrow alone. The arrow is a child of its shape, so GLSP would find the
 * shape as what to move and drag it along, where pressing the arrow starts drawing a relation from it.
 */
export class UmlFeedbackMoveMouseListener extends FeedbackMoveMouseListener {
    protected override initializeMove(target: GModelElement, event: MouseEvent): void {
        if (isRelationHandle(target)) {
            this.tracker.stopTracking();
            return;
        }
        super.initializeMove(target, event);
    }
}

@injectable()
export class UmlChangeBoundsTool extends ChangeBoundsTool {
    protected override createChangeBoundsListener(): UmlChangeBoundsListener {
        return new UmlChangeBoundsListener(this);
    }

    protected override createMoveMouseListener(): UmlFeedbackMoveMouseListener {
        return new UmlFeedbackMoveMouseListener(this);
    }
}
