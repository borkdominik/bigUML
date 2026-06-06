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

export namespace CommunicationDiagramNodeTypes {
    export const INTERACTION = representationTypeId('Communication', DefaultTypes.NODE, 'Interaction');
    export const LIFELINE = representationTypeId('Communication', DefaultTypes.NODE, 'Lifeline');
}

export namespace CommunicationDiagramEdgeTypes {
    export const MESSAGE = representationTypeId('Communication', DefaultTypes.EDGE, 'Message');
}

export namespace CommunicationDiagramModelTypes {
    // re-export nodes
    export const INTERACTION = CommunicationDiagramNodeTypes.INTERACTION;
    export const LIFELINE = CommunicationDiagramNodeTypes.LIFELINE;

    // re-export edges
    export const MESSAGE = CommunicationDiagramEdgeTypes.MESSAGE;
}

export namespace CommunicationAstTypes {
    const typeMap: Record<string, string> = {
        Interaction: CommunicationDiagramModelTypes.INTERACTION,
        Lifeline: CommunicationDiagramModelTypes.LIFELINE,
        Message: CommunicationDiagramModelTypes.MESSAGE
    };

    export function convertToAst(elementId: string): string {
        return AstTypeUtils.stripPrefix(elementId);
    }

    export function convertToElementType(astType: string): string {
        const elementType = typeMap[astType];
        if (!elementType) {
            throw new Error(`[CommunicationAstTypes] No element type found for AST type '${astType}'`);
        }
        return elementType;
    }
}
