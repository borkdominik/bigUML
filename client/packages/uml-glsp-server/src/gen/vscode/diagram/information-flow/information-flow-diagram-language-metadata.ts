// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { injectable } from 'inversify';
import type { DiagramLanguageMetadata } from '../../../../env/vscode/features/model/diagram-language-metadata.js';
import {
    InformationFlowAstTypes,
    InformationFlowDiagramEdgeTypes,
    InformationFlowDiagramNodeTypes
} from '../../../common/model-types/information-flow-diagram-model-types.js';

@injectable()
export class InformationFlowDiagramLanguageMetadata implements DiagramLanguageMetadata {
    readonly nodeTypeIds = Object.values(InformationFlowDiagramNodeTypes);
    readonly edgeTypeIds = Object.values(InformationFlowDiagramEdgeTypes);

    convertToAst(elementTypeId: string): string {
        return InformationFlowAstTypes.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        return InformationFlowAstTypes.convertToElementType(astType);
    }
}
