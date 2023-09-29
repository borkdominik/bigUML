/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { configureModelElement, SCompartmentView } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { interfaces } from 'inversify';
import { InteractableCompartment } from '../../../graph/base/compartment';
import { SEditableLabel, SEditableLabelView } from '../../../index';
import { QualifiedUtil } from '../../qualified.utils';

export function registerPropertyElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UmlDiagramType
): void {
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.COMPARTMENT, 'Property'),
        InteractableCompartment,
        SCompartmentView
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
