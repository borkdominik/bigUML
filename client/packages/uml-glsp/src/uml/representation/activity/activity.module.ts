/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { ContainerModule } from 'inversify';
import {
    registerActivityElement,
    registerActivityNodeElement,
    registerActivityPartitionElement,
    registerControlFlowElement,
    registerPinElement
} from '../../elements/index';

export const umlActivityDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    registerActivityElement(context, UmlDiagramType.ACTIVITY);
    registerActivityNodeElement(context, UmlDiagramType.ACTIVITY);
    registerActivityPartitionElement(context, UmlDiagramType.ACTIVITY);
    registerPinElement(context, UmlDiagramType.ACTIVITY);
    registerControlFlowElement(context, UmlDiagramType.ACTIVITY);
});
