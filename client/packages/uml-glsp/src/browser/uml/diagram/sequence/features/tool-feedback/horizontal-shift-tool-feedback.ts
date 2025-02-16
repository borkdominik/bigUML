/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    type AnchorComputerRegistry,
    type CommandExecutionContext,
    type CommandReturn,
    FeedbackCommand,
    GChildElement,
    type GModelElement,
    type GModelRoot,
    MouseListener,
    TYPES
} from '@eclipse-glsp/client';
import { Action, hasObjectProp, type Point } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';

export interface SDDrawHorizontalShiftAction extends Action {
    kind: typeof SDDrawHorizontalShiftAction.KIND;
    startPoint: Point;
    endPoint: Point;
}

export namespace SDDrawHorizontalShiftAction {
    export const KIND = 'drawHorizontalShift';

    export function is(object: any): object is SDDrawHorizontalShiftAction {
        return Action.hasKind(object, KIND) && hasObjectProp(object, 'startPoint') && hasObjectProp(object, 'endPoint');
    }

    export function create(options: { startPoint: Point; endPoint: Point }): SDDrawHorizontalShiftAction {
        return {
            kind: KIND,
            ...options
        };
    }
}

@injectable()
export class SDDrawHorizontalShiftCommand extends FeedbackCommand {
    static readonly KIND = SDDrawHorizontalShiftAction.KIND;

    constructor(@inject(TYPES.Action) protected action: SDDrawHorizontalShiftAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        SDdrawHorizontalShift(context, this.action.startPoint, this.action.endPoint);
        return context.root;
    }
}

export interface SDRemoveHorizontalShiftAction extends Action {
    kind: typeof SDRemoveHorizontalShiftAction.KIND;
}

export namespace SDRemoveHorizontalShiftAction {
    export const KIND = 'removeHorizontalShift';

    export function is(object: any): object is SDRemoveHorizontalShiftAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): SDRemoveHorizontalShiftAction {
        return { kind: KIND };
    }
}

@injectable()
export class SDRemoveHorizontalShiftCommand extends FeedbackCommand {
    static readonly KIND = SDRemoveHorizontalShiftAction.KIND;

    execute(context: CommandExecutionContext): CommandReturn {
        SDremoveHorizontalShift(context.root);
        return context.root;
    }
}

export class SDHorizontalShiftEndMovingMouseListener extends MouseListener {
    constructor(protected anchorRegistry: AnchorComputerRegistry) {
        super();
    }

    override mouseMove(_target: GModelElement, _event: MouseEvent): Action[] {
        return [];
    }
}

export function SDhorizontalShiftId(root: GModelRoot): string {
    return root.id + '_' + SD_HORIZONTAL_SHIFT;
}

export const SD_HORIZONTAL_SHIFT = 'horizontalShift';

export function SDdrawHorizontalShift(context: CommandExecutionContext, startPoint: Point, endPoint: Point): void {
    const root = context.root;

    SDremoveHorizontalShift(root);

    const horizontalShiftSchema = {
        type: SD_HORIZONTAL_SHIFT,
        id: SDhorizontalShiftId(root),
        startPoint: startPoint,
        endPoint: endPoint
    };

    const horizontalShift = context.modelFactory.createElement(horizontalShiftSchema);
    root.add(horizontalShift);
}

export function SDremoveHorizontalShift(root: GModelRoot): void {
    const horizontalShift = root.index.getById(SDhorizontalShiftId(root));
    if (horizontalShift instanceof GChildElement) {
        root.remove(horizontalShift);
    }
}
