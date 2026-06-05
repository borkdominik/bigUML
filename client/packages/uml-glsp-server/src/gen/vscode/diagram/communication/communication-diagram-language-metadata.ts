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
    CommunicationAstTypes,
    CommunicationDiagramEdgeTypes,
    CommunicationDiagramNodeTypes
} from '../../../common/model-types/communication-diagram-model-types.js';

@injectable()
export class CommunicationDiagramLanguageMetadata implements DiagramLanguageMetadata {
    readonly nodeTypeIds = Object.values(CommunicationDiagramNodeTypes);
    readonly edgeTypeIds = Object.values(CommunicationDiagramEdgeTypes);

    convertToAst(elementTypeId: string): string {
        return CommunicationAstTypes.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        return CommunicationAstTypes.convertToElementType(astType);
    }
}
