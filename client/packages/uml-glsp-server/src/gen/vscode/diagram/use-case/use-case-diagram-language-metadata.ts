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
    UseCaseAstTypes,
    UseCaseDiagramEdgeTypes,
    UseCaseDiagramNodeTypes
} from '../../../common/model-types/use-case-diagram-model-types.js';

@injectable()
export class UseCaseDiagramLanguageMetadata implements DiagramLanguageMetadata {
    readonly nodeTypeIds = Object.values(UseCaseDiagramNodeTypes);
    readonly edgeTypeIds = Object.values(UseCaseDiagramEdgeTypes);

    convertToAst(elementTypeId: string): string {
        return UseCaseAstTypes.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        return UseCaseAstTypes.convertToElementType(astType);
    }
}
