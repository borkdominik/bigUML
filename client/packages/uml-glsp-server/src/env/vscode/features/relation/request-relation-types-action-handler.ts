/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { RelationTypesResponseAction, RequestRelationTypesAction } from '@borkdominik-biguml/uml-glsp-server';
import { type Action, type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { RelationTypeResolver } from './relation-type-resolver.js';

/** Answers the "Create relation" tool with the relations that may run between the ends it picked. */
@injectable()
export class RequestRelationTypesActionHandler implements ActionHandler {
    readonly actionKinds = [RequestRelationTypesAction.KIND];

    @inject(RelationTypeResolver)
    protected readonly resolver: RelationTypeResolver;

    execute(action: RequestRelationTypesAction): MaybePromise<Action[]> {
        const relationTypes = this.resolver.relationTypesBetween(action.sourceElementId, action.targetElementId);
        return [RelationTypesResponseAction.create(relationTypes, action.requestId)];
    }
}
