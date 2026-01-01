/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractCreateEdgeOperationHandler } from '../../../../common/handler/abstract-create-edge-operation-handler.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class ClassCreateEdgeOperationHandler extends AbstractCreateEdgeOperationHandler {
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

    @inject(ClassDiagramModelState)
    declare modelState: ClassDiagramModelState;
}
