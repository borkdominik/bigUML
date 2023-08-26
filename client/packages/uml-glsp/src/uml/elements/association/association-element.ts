/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { configureModelElement, GEdgeView, SEdge } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { interfaces } from 'inversify';
import { QualifiedUtil } from '../../qualified.utils';

export function registerAssociationElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UmlDiagramType
): void {
    const ASSOCIATION = QualifiedUtil.representationTypeId(representation, DefaultTypes.EDGE, 'Association');
    const ASSOCIATION_AGGREGATION = QualifiedUtil.representationTemplateTypeId(
        representation,
        DefaultTypes.EDGE,
        'aggregation',
        'Association'
    );
    const ASSOCIATION_COMPOSITION = QualifiedUtil.representationTemplateTypeId(
        representation,
        DefaultTypes.EDGE,
        'composition',
        'Association'
    );

    configureModelElement(context, ASSOCIATION, SEdge, GEdgeView);
    configureModelElement(context, ASSOCIATION_AGGREGATION, SEdge, GEdgeView);
    configureModelElement(context, ASSOCIATION_COMPOSITION, SEdge, GEdgeView);
}
