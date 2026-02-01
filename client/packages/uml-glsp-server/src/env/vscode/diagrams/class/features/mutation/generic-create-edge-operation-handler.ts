/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { injectable } from 'inversify';
import { GenericCreateEdgeOperationHandler } from '../../../../features/mutation/handler/generic-create-edge-operation-handler.js';
import { ModelTypes } from '../../model/model-types.js';

// TODO: Haydar will be removed
@injectable()
export class ClassCreateEdgeOperationHandler extends GenericCreateEdgeOperationHandler {
    readonly elementTypeIds = [
        ModelTypes.ABSTRACTION,
        ModelTypes.AGGREGATION,
        ModelTypes.ASSOCIATION,
        ModelTypes.COMPOSITION,
        ModelTypes.DEPENDENCY,
        ModelTypes.GENERALIZATION,
        ModelTypes.INTERFACE_REALIZATION,
        ModelTypes.PACKAGE_IMPORT,
        ModelTypes.PACKAGE_MERGE,
        ModelTypes.REALIZATION,
        ModelTypes.SUBSTITUTION,
        ModelTypes.USAGE
    ];
}
