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

export interface DrawVerticalShiftAction extends Action {
    kind: typeof DrawVerticalShiftAction.KIND;
    startPoint: Point;
    endPoint: Point;
}

export namespace DrawVerticalShiftAction {
    export const KIND = 'drawVerticalShift';

    export function is(object: any): object is DrawVerticalShiftAction {
        return Action.hasKind(object, KIND) && hasObjectProp(object, 'startPoint') && hasObjectProp(object, 'endPoint');
    }

    export function create(options: { startPoint: Point; endPoint: Point }): DrawVerticalShiftAction {
        return {
            kind: KIND,
            ...options
        };
    }
}

@injectable()
export class DrawVerticalShiftCommand extends FeedbackCommand {
    static readonly KIND = DrawVerticalShiftAction.KIND;

    constructor(@inject(TYPES.Action) protected action: DrawVerticalShiftAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        drawVerticalShift(context, this.action.startPoint, this.action.endPoint);
        return context.root;
    }
}

export interface RemoveVerticalShiftAction extends Action {
    kind: typeof RemoveVerticalShiftAction.KIND;
}

export namespace RemoveVerticalShiftAction {
    export const KIND = 'removeVerticalShift';

    export function is(object: any): object is RemoveVerticalShiftAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): RemoveVerticalShiftAction {
        return { kind: KIND };
    }
}

@injectable()
export class RemoveVerticalShiftCommand extends FeedbackCommand {
    static readonly KIND = RemoveVerticalShiftAction.KIND;

    execute(context: CommandExecutionContext): CommandReturn {
        removeVerticalShift(context.root);
        return context.root;
    }
}

export class VerticalShiftEndMovingMouseListener extends MouseListener {
    constructor(protected anchorRegistry: AnchorComputerRegistry) {
        super();
    }

    override mouseMove(target: SModelElement, event: MouseEvent): Action[] {
        return [];
    }
}

export function verticalShiftId(root: SModelRoot): string {
    return root.id + '_' + VERTICAL_SHIFT;
}

export const VERTICAL_SHIFT = 'verticalShift';

export function drawVerticalShift(context: CommandExecutionContext, startPoint: Point, endPoint: Point): void {
    const root = context.root;

    removeVerticalShift(root);

    const verticalShiftSchema = {
        type: VERTICAL_SHIFT,
        id: verticalShiftId(root),
        startPoint: startPoint,
        endPoint: endPoint
    };

    const verticalShift = context.modelFactory.createElement(verticalShiftSchema);
    root.add(verticalShift);
}

export function removeVerticalShift(root: SModelRoot): void {
    const verticalShift = root.index.getById(verticalShiftId(root));
    if (verticalShift instanceof SChildElement) {
        root.remove(verticalShift);
    }
}
