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

export interface SDDrawVerticalShiftAction extends Action {
    kind: typeof SDDrawVerticalShiftAction.KIND;
    startPoint: Point;
    endPoint: Point;
}

export namespace SDDrawVerticalShiftAction {
    export const KIND = 'drawVerticalShift';

    export function is(object: any): object is SDDrawVerticalShiftAction {
        return Action.hasKind(object, KIND) && hasObjectProp(object, 'startPoint') && hasObjectProp(object, 'endPoint');
    }

    export function create(options: { startPoint: Point; endPoint: Point }): SDDrawVerticalShiftAction {
        return {
            kind: KIND,
            ...options
        };
    }
}

@injectable()
export class SDDrawVerticalShiftCommand extends FeedbackCommand {
    static readonly KIND = SDDrawVerticalShiftAction.KIND;

    constructor(@inject(TYPES.Action) protected action: SDDrawVerticalShiftAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        SDdrawVerticalShift(context, this.action.startPoint, this.action.endPoint);
        return context.root;
    }
}

export interface SDRemoveVerticalShiftAction extends Action {
    kind: typeof SDRemoveVerticalShiftAction.KIND;
}

export namespace SDRemoveVerticalShiftAction {
    export const KIND = 'removeVerticalShift';

    export function is(object: any): object is SDRemoveVerticalShiftAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): SDRemoveVerticalShiftAction {
        return { kind: KIND };
    }
}

@injectable()
export class SDRemoveVerticalShiftCommand extends FeedbackCommand {
    static readonly KIND = SDRemoveVerticalShiftAction.KIND;

    execute(context: CommandExecutionContext): CommandReturn {
        SDremoveVerticalShift(context.root);
        return context.root;
    }
}

export class SDVerticalShiftEndMovingMouseListener extends MouseListener {
    constructor(protected anchorRegistry: AnchorComputerRegistry) {
        super();
    }

    override mouseMove(_target: GModelElement, _event: MouseEvent): Action[] {
        return [];
    }
}

export function SDverticalShiftId(root: GModelRoot): string {
    return root.id + '_' + SD_VERTICAL_SHIFT;
}

export const SD_VERTICAL_SHIFT = 'verticalShift';

export function SDdrawVerticalShift(context: CommandExecutionContext, startPoint: Point, endPoint: Point): void {
    const root = context.root;

    SDremoveVerticalShift(root);

    const verticalShiftSchema = {
        type: SD_VERTICAL_SHIFT,
        id: SDverticalShiftId(root),
        startPoint: startPoint,
        endPoint: endPoint
    };

    const verticalShift = context.modelFactory.createElement(verticalShiftSchema);
    root.add(verticalShift);
}

export function SDremoveVerticalShift(root: GModelRoot): void {
    const verticalShift = root.index.getById(SDverticalShiftId(root));
    if (verticalShift instanceof GChildElement) {
        root.remove(verticalShift);
    }
}
