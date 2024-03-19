/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { configureModelElement } from '@eclipse-glsp/client';
import { interfaces } from 'inversify';
import { QualifiedUtil } from '../../qualified.utils';
import { GEditableLabel, GEditableLabelView } from '../../views/uml-label.view';
import { NamedElement, NamedElementView } from '../index';

export function registerPropertyElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UMLDiagramType
): void {
    configureModelElement(context, QualifiedUtil.typeId(representation, 'Property'), NamedElement, NamedElementView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'PropertyType'), GEditableLabel, GEditableLabelView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'PropertyMultiplicity'), GEditableLabel, GEditableLabelView);
}
