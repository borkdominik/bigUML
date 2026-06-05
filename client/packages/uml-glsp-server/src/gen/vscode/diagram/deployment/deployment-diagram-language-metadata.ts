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
    DeploymentAstTypes,
    DeploymentDiagramEdgeTypes,
    DeploymentDiagramNodeTypes
} from '../../../common/model-types/deployment-diagram-model-types.js';

@injectable()
export class DeploymentDiagramLanguageMetadata implements DiagramLanguageMetadata {
    readonly nodeTypeIds = Object.values(DeploymentDiagramNodeTypes);
    readonly edgeTypeIds = Object.values(DeploymentDiagramEdgeTypes);

    convertToAst(elementTypeId: string): string {
        return DeploymentAstTypes.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        return DeploymentAstTypes.convertToElementType(astType);
    }
}
