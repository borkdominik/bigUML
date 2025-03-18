/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ApplyTypeHintsCommand, getElementTypeId, type GModelElement, type GModelElementSchema, type ShapeTypeHint } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class UMLApplyTypeHintsCommand extends ApplyTypeHintsCommand {
    protected override isContainableElement(input: GModelElement | GModelElementSchema | string, hint: ShapeTypeHint): boolean {
        const elementType = getElementTypeId(input);
        return hint.containableElementTypeIds?.some(type => elementType === type) ?? false;
    }
}
