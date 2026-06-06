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
    PackageAstTypes,
    PackageDiagramEdgeTypes,
    PackageDiagramNodeTypes
} from '../../../common/model-types/package-diagram-model-types.js';

@injectable()
export class PackageDiagramLanguageMetadata implements DiagramLanguageMetadata {
    readonly nodeTypeIds = Object.values(PackageDiagramNodeTypes);
    readonly edgeTypeIds = Object.values(PackageDiagramEdgeTypes);

    convertToAst(elementTypeId: string): string {
        return PackageAstTypes.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        return PackageAstTypes.convertToElementType(astType);
    }
}
