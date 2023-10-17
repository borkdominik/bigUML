/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { configureModelElement } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { interfaces } from 'inversify';
import { SEditableLabel, SEditableLabelView } from '../../../index';
import { QualifiedUtil } from '../../qualified.utils';
import { NamedElement, NamedElementView } from '../index';

export function registerPropertyElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UmlDiagramType
): void {
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE, 'Property'),
        NamedElement,
        NamedElementView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.LABEL, 'Property-type'),
        SEditableLabel,
        SEditableLabelView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.LABEL, 'Property-multiplicity'),
        SEditableLabel,
        SEditableLabelView
    );
}
