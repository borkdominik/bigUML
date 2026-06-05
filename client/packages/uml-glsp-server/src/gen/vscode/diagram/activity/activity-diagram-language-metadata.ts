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
    ActivityAstTypes,
    ActivityDiagramEdgeTypes,
    ActivityDiagramNodeTypes
} from '../../../common/model-types/activity-diagram-model-types.js';

@injectable()
export class ActivityDiagramLanguageMetadata implements DiagramLanguageMetadata {
    readonly nodeTypeIds = Object.values(ActivityDiagramNodeTypes);
    readonly edgeTypeIds = Object.values(ActivityDiagramEdgeTypes);

    convertToAst(elementTypeId: string): string {
        return ActivityAstTypes.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        return ActivityAstTypes.convertToElementType(astType);
    }
}
