/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractCreateNodeOperationHandler } from '../../../../common/handler/abstract-create-node-opertation-handler.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class ClassCreateNodeOperationHandler extends AbstractCreateNodeOperationHandler {
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

    @inject(ClassDiagramModelState)
    declare modelState: ClassDiagramModelState;
}
