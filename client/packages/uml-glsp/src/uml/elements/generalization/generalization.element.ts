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

export class GeneralizationEdge extends LibavoidEdge {
    override routeType = RouteType.PolyLine;
}

export function registerGeneralizationElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UmlDiagramType
): void {
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.EDGE, 'Generalization'),
        GeneralizationEdge,
        GEdgeView,
        { disable: [editFeature] }
    );
}
