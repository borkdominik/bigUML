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
export class PackageCreateNodeOperationHandler extends AbstractCreateEdgeOperationHandler {
    readonly elementTypeIds = [ModelTypes.CLASS, ModelTypes.PACKAGE];

    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;
}
