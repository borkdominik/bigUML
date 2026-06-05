/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { DiagramLanguageMetadata } from '@borkdominik-biguml/uml-glsp-server/vscode';

export interface GetPropertyPaletteHandlerContext<T> {
    semanticElement: T;
    languageMetadata: DiagramLanguageMetadata;
}
