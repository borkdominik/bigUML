/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { LangiumDocument } from 'langium';

/** The diagnostic code Langium gives a reference that could not be resolved. */
const LINKING_ERROR_CODE = 'linking-error';

/**
 * Whether a document is in a state another client may take over from the text editor.
 *
 * A document the text editor has left with syntax or validation errors cannot be turned into a model
 * for the diagram, so nothing is taken from it. A reference that does not resolve is different: the
 * model is whole, only one of its references is dangling, and the diagram can show that.
 */
export function isFreeOfBlockingErrors(document: LangiumDocument): boolean {
    const diagnostics = document.diagnostics;
    if (!diagnostics) {
        return true;
    }
    if (diagnostics.length === 0 && document.parseResult.parserErrors.length === 0) {
        return true;
    }
    return diagnostics.every(diagnostic => diagnostic.data?.code === LINKING_ERROR_CODE);
}
