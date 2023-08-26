/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { configureModelElement, SCompartmentView, SLabelView } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { interfaces } from 'inversify';
import { InteractableCompartment } from '../../../graph/uml-compartment';
import { SEditableLabel } from '../../../index';
import { QualifiedUtil } from '../../qualified.utils';

export function registerPropertyElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UmlDiagramType
): void {
    const PROPERTY = QualifiedUtil.representationTypeId(representation, DefaultTypes.COMPARTMENT, 'Property');
    const PROPERTY_LABEL_TYPE = QualifiedUtil.representationTypeId(representation, DefaultTypes.LABEL, 'Property-type');
    const PROPERTY_LABEL_MULTIPLICITY = QualifiedUtil.representationTypeId(representation, DefaultTypes.LABEL, 'Property-multiplicity');

    configureModelElement(context, PROPERTY, InteractableCompartment, SCompartmentView);
    configureModelElement(context, PROPERTY_LABEL_TYPE, SEditableLabel, SLabelView);
    configureModelElement(context, PROPERTY_LABEL_MULTIPLICITY, SEditableLabel, SLabelView);
}
