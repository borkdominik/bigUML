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
    AnchorComputerRegistry,
    CommandExecutionContext,
    CommandReturn,
    FeedbackCommand,
    MouseListener,
    SChildElement,
    SModelElement,
    SModelRoot,
    TYPES
} from '@eclipse-glsp/client';
import { Action, Point, hasObjectProp } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';

export interface DrawHorizontalShiftAction extends Action {
    kind: typeof DrawHorizontalShiftAction.KIND;
    startPoint: Point;
    endPoint: Point;
}

export namespace DrawHorizontalShiftAction {
    export const KIND = 'drawHorizontalShift';

    export function is(object: any): object is DrawHorizontalShiftAction {
        return Action.hasKind(object, KIND) && hasObjectProp(object, 'startPoint') && hasObjectProp(object, 'endPoint');
    }

    export function create(options: { startPoint: Point; endPoint: Point }): DrawHorizontalShiftAction {
        return {
            kind: KIND,
            ...options
        };
    }
}

@injectable()
export class DrawHorizontalShiftCommand extends FeedbackCommand {
    static readonly KIND = DrawHorizontalShiftAction.KIND;

    constructor(@inject(TYPES.Action) protected action: DrawHorizontalShiftAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        drawHorizontalShift(context, this.action.startPoint, this.action.endPoint);
        return context.root;
    }
}

export interface RemoveHorizontalShiftAction extends Action {
    kind: typeof RemoveHorizontalShiftAction.KIND;
}

export namespace RemoveHorizontalShiftAction {
    export const KIND = 'removeHorizontalShift';

    export function is(object: any): object is RemoveHorizontalShiftAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): RemoveHorizontalShiftAction {
        return { kind: KIND };
    }
}

@injectable()
export class RemoveHorizontalShiftCommand extends FeedbackCommand {
    static readonly KIND = RemoveHorizontalShiftAction.KIND;

    execute(context: CommandExecutionContext): CommandReturn {
        removeHorizontalShift(context.root);
        return context.root;
    }
}

export class HorizontalShiftEndMovingMouseListener extends MouseListener {
    constructor(protected anchorRegistry: AnchorComputerRegistry) {
        super();
    }

    override mouseMove(target: SModelElement, event: MouseEvent): Action[] {
        return [];
    }
}

export function horizontalShiftId(root: SModelRoot): string {
    return root.id + '_' + HORIZONTAL_SHIFT;
}

export const HORIZONTAL_SHIFT = 'horizontalShift';

export function drawHorizontalShift(context: CommandExecutionContext, startPoint: Point, endPoint: Point): void {
    const root = context.root;

    removeHorizontalShift(root);

    const horizontalShiftSchema = {
        type: HORIZONTAL_SHIFT,
        id: horizontalShiftId(root),
        startPoint: startPoint,
        endPoint: endPoint
    };

    const horizontalShift = context.modelFactory.createElement(horizontalShiftSchema);
    root.add(horizontalShift);
}

export function removeHorizontalShift(root: SModelRoot): void {
    const horizontalShift = root.index.getById(horizontalShiftId(root));
    if (horizontalShift instanceof SChildElement) {
        root.remove(horizontalShift);
    }
}
