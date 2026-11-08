/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    type Action,
    type CommandExecutionContext,
    type CommandReturn,
    FeedbackCommand,
    GParentElement,
    TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { addRelationHandles, isRelationHandle, removeRelationHandles } from './relation-handle.js';

/** Shows the relation arrows on `elementId`, and on nothing else. */
export interface ShowRelationHandlesAction extends Action {
    kind: typeof ShowRelationHandlesAction.KIND;
    elementId: string;
}

export namespace ShowRelationHandlesAction {
    export const KIND = 'showRelationHandles';

    export function create(elementId: string): ShowRelationHandlesAction {
        return { kind: KIND, elementId };
    }
}

/** Takes the relation arrows off whatever shows them. */
export interface HideRelationHandlesAction extends Action {
    kind: typeof HideRelationHandlesAction.KIND;
}

export namespace HideRelationHandlesAction {
    export const KIND = 'hideRelationHandles';

    export function create(): HideRelationHandlesAction {
        return { kind: KIND };
    }
}

/** Every element that holds relation arrows. */
function ownersOfHandles(context: CommandExecutionContext): GParentElement[] {
    const owners = Array.from(context.root.index.all())
        .filter(isRelationHandle)
        .map(handle => handle.parent);
    return [...new Set(owners)];
}

@injectable()
export class ShowRelationHandlesCommand extends FeedbackCommand {
    static readonly KIND = ShowRelationHandlesAction.KIND;

    @inject(TYPES.Action) protected action: ShowRelationHandlesAction;

    execute(context: CommandExecutionContext): CommandReturn {
        ownersOfHandles(context)
            .filter(owner => owner.id !== this.action.elementId)
            .forEach(removeRelationHandles);
        const element = context.root.index.getById(this.action.elementId);
        if (element instanceof GParentElement) {
            addRelationHandles(element);
        }
        return context.root;
    }
}

@injectable()
export class HideRelationHandlesCommand extends FeedbackCommand {
    static readonly KIND = HideRelationHandlesAction.KIND;

    @inject(TYPES.Action) protected action: HideRelationHandlesAction;

    execute(context: CommandExecutionContext): CommandReturn {
        ownersOfHandles(context).forEach(removeRelationHandles);
        return context.root;
    }
}
