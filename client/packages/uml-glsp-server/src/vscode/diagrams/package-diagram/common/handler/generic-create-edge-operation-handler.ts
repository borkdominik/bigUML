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
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class PackageCreateEdgeOperationHandler extends AbstractCreateEdgeOperationHandler {
    readonly elementTypeIds = [
        ModelTypes.ABSTRACTION,
        ModelTypes.DEPENDENCY,
        ModelTypes.ELEMENT_IMPORT,
        ModelTypes.PACKAGE_IMPORT,
        ModelTypes.PACKAGE_MERGE,
        ModelTypes.USAGE
    ];

    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;
}
