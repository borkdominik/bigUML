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
  ClassAstTypes,
  ClassDiagramEdgeTypes,
  ClassDiagramNodeTypes,
} from '../../../common/model-types/class-diagram-model-types.js';

@injectable()
export class ClassDiagramLanguageMetadata implements DiagramLanguageMetadata {
  readonly nodeTypeIds = Object.values(ClassDiagramNodeTypes);
  readonly edgeTypeIds = Object.values(ClassDiagramEdgeTypes);

  convertToAst(elementTypeId: string): string {
    return ClassAstTypes.convertToAst(elementTypeId);
  }
}
