/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { injectable } from 'inversify';
import { GenericCreateNodeOperationHandler } from '../../../../features/mutation/handler/generic-create-node-opertation-handler.js';
import { ModelTypes } from '../../model/model-types.js';

// TODO: Haydar will be removed
@injectable()
export class ClassCreateNodeOperationHandler extends GenericCreateNodeOperationHandler {
    readonly elementTypeIds = [
        ModelTypes.ABSTRACT_CLASS,
        ModelTypes.CLASS,
        ModelTypes.DATA_TYPE,
        ModelTypes.ENUMERATION,
        ModelTypes.ENUMERATION_LITERAL,
        ModelTypes.INSTANCE_SPECIFICATION,
        ModelTypes.INTERFACE,
        ModelTypes.LITERAL_SPECIFICATION,
        ModelTypes.OPERATION,
        ModelTypes.PACKAGE,
        ModelTypes.PARAMETER,
        ModelTypes.PRIMITIVE_TYPE,
        ModelTypes.PROPERTY,
        ModelTypes.SLOT
    ];
}
