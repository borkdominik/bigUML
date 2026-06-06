// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DefaultTypes } from '@eclipse-glsp/server';
import { representationTypeId } from '../../../env/common/model/model-type-utils.js';
import { AstTypeUtils } from '../../../env/common/model/model-type-utils.js';

export namespace UseCaseDiagramNodeTypes {
    export const USE_CASE = representationTypeId('UseCase', DefaultTypes.NODE, 'UseCase');
    export const ACTOR = representationTypeId('UseCase', DefaultTypes.NODE, 'Actor');
    export const SUBJECT = representationTypeId('UseCase', DefaultTypes.NODE, 'Subject');
}

export namespace UseCaseDiagramEdgeTypes {
    export const INCLUDE = representationTypeId('UseCase', DefaultTypes.EDGE, 'Include');
    export const EXTEND = representationTypeId('UseCase', DefaultTypes.EDGE, 'Extend');
    export const ASSOCIATION = representationTypeId('UseCase', DefaultTypes.EDGE, 'Association');
    export const GENERALIZATION = representationTypeId('UseCase', DefaultTypes.EDGE, 'Generalization');
}

export namespace UseCaseDiagramModelTypes {
    // re-export nodes
    export const USE_CASE = UseCaseDiagramNodeTypes.USE_CASE;
    export const ACTOR = UseCaseDiagramNodeTypes.ACTOR;
    export const SUBJECT = UseCaseDiagramNodeTypes.SUBJECT;

    // re-export edges
    export const INCLUDE = UseCaseDiagramEdgeTypes.INCLUDE;
    export const EXTEND = UseCaseDiagramEdgeTypes.EXTEND;
    export const ASSOCIATION = UseCaseDiagramEdgeTypes.ASSOCIATION;
    export const GENERALIZATION = UseCaseDiagramEdgeTypes.GENERALIZATION;
}

export namespace UseCaseAstTypes {
    const typeMap: Record<string, string> = {
        UseCase: UseCaseDiagramModelTypes.USE_CASE,
        Actor: UseCaseDiagramModelTypes.ACTOR,
        Subject: UseCaseDiagramModelTypes.SUBJECT,
        Include: UseCaseDiagramModelTypes.INCLUDE,
        Extend: UseCaseDiagramModelTypes.EXTEND,
        Association: UseCaseDiagramModelTypes.ASSOCIATION,
        Generalization: UseCaseDiagramModelTypes.GENERALIZATION
    };

    export function convertToAst(elementId: string): string {
        return AstTypeUtils.stripPrefix(elementId);
    }

    export function convertToElementType(astType: string): string {
        const elementType = typeMap[astType];
        if (!elementType) {
            throw new Error(`[UseCaseAstTypes] No element type found for AST type '${astType}'`);
        }
        return elementType;
    }
}
