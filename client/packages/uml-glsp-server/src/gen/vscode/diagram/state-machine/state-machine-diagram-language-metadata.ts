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
    StateMachineAstTypes,
    StateMachineDiagramEdgeTypes,
    StateMachineDiagramNodeTypes
} from '../../../common/model-types/state-machine-diagram-model-types.js';

@injectable()
export class StateMachineDiagramLanguageMetadata implements DiagramLanguageMetadata {
    readonly nodeTypeIds = Object.values(StateMachineDiagramNodeTypes);
    readonly edgeTypeIds = Object.values(StateMachineDiagramEdgeTypes);

    convertToAst(elementTypeId: string): string {
        return StateMachineAstTypes.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        return StateMachineAstTypes.convertToElementType(astType);
    }
}
