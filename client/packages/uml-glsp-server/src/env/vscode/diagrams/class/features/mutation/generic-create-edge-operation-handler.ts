/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ClassDiagramEdgeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { injectable } from 'inversify';
import { GenericCreateEdgeOperationHandler } from '../../../../features/mutation/handler/generic-create-edge-operation-handler.js';

// TODO: Haydar will be removed
@injectable()
export class ClassCreateEdgeOperationHandler extends GenericCreateEdgeOperationHandler {
    readonly elementTypeIds = [
        ClassDiagramEdgeTypes.ABSTRACTION,
        ClassDiagramEdgeTypes.AGGREGATION,
        ClassDiagramEdgeTypes.ASSOCIATION,
        ClassDiagramEdgeTypes.COMPOSITION,
        ClassDiagramEdgeTypes.DEPENDENCY,
        ClassDiagramEdgeTypes.GENERALIZATION,
        ClassDiagramEdgeTypes.INTERFACE_REALIZATION,
        ClassDiagramEdgeTypes.PACKAGE_IMPORT,
        ClassDiagramEdgeTypes.PACKAGE_MERGE,
        ClassDiagramEdgeTypes.REALIZATION,
        ClassDiagramEdgeTypes.SUBSTITUTION,
        ClassDiagramEdgeTypes.USAGE
    ];
}
