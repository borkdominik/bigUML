/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isValidMultiplicity, MULTIPLICITY_FORMAT_MESSAGE } from '@borkdominik-biguml/uml-glsp-server';
import { isMultiplicityProperty } from '@borkdominik-biguml/uml-model-server/validation';
import { type GModelElement, LabelEditValidator, ModelState } from '@eclipse-glsp/server';
import { ValidationStatus } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';
import { labelProperty } from '../../notation/label-ids.js';
import type { DiagramModelState } from '../model/diagram-model-state.js';

/**
 * Checks a label while it is being edited on the canvas, holding it to the same rules the property
 * palette does - so a multiplicity typed on the line is refused just as one typed in the palette is,
 * rather than written to the file as whatever was typed.
 */
@injectable()
export class UmlLabelEditValidator extends LabelEditValidator {
    @inject(ModelState)
    protected readonly modelState: DiagramModelState;

    validate(label: string, element: GModelElement): ValidationStatus {
        const ownerId = element.parent?.id;
        const property = ownerId ? labelProperty(element.id, ownerId) : undefined;
        if (!property) {
            return ValidationStatus.NONE;
        }

        // Which properties hold a multiplicity is the definitions' to say (`@Language.multiplicity`). An
        // empty one clears it, which is allowed; anything else has to be a whole one.
        const owner = this.modelState.index.findIdElement(ownerId!) as { $type?: string } | undefined;
        const value = label.trim();
        if (isMultiplicityProperty(owner?.$type, property) && value !== '' && !isValidMultiplicity(value)) {
            return { severity: ValidationStatus.Severity.ERROR, message: MULTIPLICITY_FORMAT_MESSAGE };
        }
        return ValidationStatus.NONE;
    }
}
