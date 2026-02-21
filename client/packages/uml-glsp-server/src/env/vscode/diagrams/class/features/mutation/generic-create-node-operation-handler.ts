/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { injectable } from 'inversify';
import { GenericCreateNodeOperationHandler } from '../../../../features/mutation/handler/generic-create-node-opertation-handler.js';

// TODO: Haydar will be removed
@injectable()
export class ClassCreateNodeOperationHandler extends GenericCreateNodeOperationHandler {
    readonly elementTypeIds = [
        ClassDiagramNodeTypes.ABSTRACT_CLASS,
        ClassDiagramNodeTypes.CLASS,
        ClassDiagramNodeTypes.DATA_TYPE,
        ClassDiagramNodeTypes.ENUMERATION,
        ClassDiagramNodeTypes.ENUMERATION_LITERAL,
        ClassDiagramNodeTypes.INSTANCE_SPECIFICATION,
        ClassDiagramNodeTypes.INTERFACE,
        ClassDiagramNodeTypes.LITERAL_SPECIFICATION,
        ClassDiagramNodeTypes.OPERATION,
        ClassDiagramNodeTypes.PACKAGE,
        ClassDiagramNodeTypes.PARAMETER,
        ClassDiagramNodeTypes.PRIMITIVE_TYPE,
        ClassDiagramNodeTypes.PROPERTY,
        ClassDiagramNodeTypes.SLOT
    ];
}
