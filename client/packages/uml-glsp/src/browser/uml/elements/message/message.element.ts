/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { configureModelElement, GEdge, GEdgeView } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { type interfaces } from 'inversify';
import { QualifiedUtil } from '../../qualified.utils.js';
import { GEditableLabel } from '../../views/uml-label.view.js';
import { MessageArrowLabelView } from './message-arrow-label.view.js';

export function registerMessageElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UMLDiagramType
): void {
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.LABEL, 'message-arrow-edge-name'),
        GEditableLabel,
        MessageArrowLabelView
    );
    configureModelElement(context, QualifiedUtil.typeId(representation, 'Message'), GEdge, GEdgeView);
}
