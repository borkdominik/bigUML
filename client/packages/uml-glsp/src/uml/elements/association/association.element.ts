/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { GEdgeView, configureModelElement, editFeature } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { interfaces } from 'inversify';
import { LibavoidEdge, RouteType } from 'sprotty-routing-libavoid';
import { QualifiedUtil } from '../../qualified.utils';

export class AssociationEdge extends LibavoidEdge {
    override routeType = RouteType.Orthogonal;
}

export function registerAssociationElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UmlDiagramType
): void {
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.EDGE, 'Association'),
        AssociationEdge,
        GEdgeView,
        { disable: [editFeature] }
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTemplateTypeId(representation, DefaultTypes.EDGE, 'aggregation', 'Association'),
        AssociationEdge,
        GEdgeView,
        { disable: [editFeature] }
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTemplateTypeId(representation, DefaultTypes.EDGE, 'composition', 'Association'),
        AssociationEdge,
        GEdgeView,
        { disable: [editFeature] }
    );
}
