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
import { SEditableLabel } from '../../../features/graph/index';
import { QualifiedUtil } from '../../qualified.utils';
import { MessageArrowLabelView } from './message-arrow-label.view';

export function registerMessageElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UmlDiagramType
): void {
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.LABEL, 'message-arrow-edge-name'),
        SEditableLabel,
        MessageArrowLabelView
    );
    configureModelElement(context, QualifiedUtil.representationTypeId(representation, DefaultTypes.EDGE, 'Message'), SEdge, GEdgeView);
}
