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

export namespace InformationFlowDiagramNodeTypes {
    export const ACTOR = representationTypeId('InformationFlow', DefaultTypes.NODE, 'Actor');
    export const CLASS = representationTypeId('InformationFlow', DefaultTypes.NODE, 'Class');
    export const PROPERTY = representationTypeId('InformationFlow', DefaultTypes.NODE, 'Property');
    export const OPERATION = representationTypeId('InformationFlow', DefaultTypes.NODE, 'Operation');
    export const PARAMETER = representationTypeId('InformationFlow', DefaultTypes.NODE, 'Parameter');
}

export namespace InformationFlowDiagramEdgeTypes {
    export const INFORMATION_FLOW = representationTypeId('InformationFlow', DefaultTypes.EDGE, 'InformationFlow');
}

export namespace InformationFlowDiagramModelTypes {
    // re-export nodes
    export const ACTOR = InformationFlowDiagramNodeTypes.ACTOR;
    export const CLASS = InformationFlowDiagramNodeTypes.CLASS;
    export const PROPERTY = InformationFlowDiagramNodeTypes.PROPERTY;
    export const OPERATION = InformationFlowDiagramNodeTypes.OPERATION;
    export const PARAMETER = InformationFlowDiagramNodeTypes.PARAMETER;

    // re-export edges
    export const INFORMATION_FLOW = InformationFlowDiagramEdgeTypes.INFORMATION_FLOW;
}

export namespace InformationFlowAstTypes {
    const typeMap: Record<string, string> = {
        Actor: InformationFlowDiagramModelTypes.ACTOR,
        Class: InformationFlowDiagramModelTypes.CLASS,
        Property: InformationFlowDiagramModelTypes.PROPERTY,
        Operation: InformationFlowDiagramModelTypes.OPERATION,
        Parameter: InformationFlowDiagramModelTypes.PARAMETER,
        InformationFlow: InformationFlowDiagramModelTypes.INFORMATION_FLOW
    };

    export function convertToAst(elementId: string): string {
        return AstTypeUtils.stripPrefix(elementId);
    }

    export function convertToElementType(astType: string): string {
        const elementType = typeMap[astType];
        if (!elementType) {
            throw new Error(`[InformationFlowAstTypes] No element type found for AST type '${astType}'`);
        }
        return elementType;
    }
}
