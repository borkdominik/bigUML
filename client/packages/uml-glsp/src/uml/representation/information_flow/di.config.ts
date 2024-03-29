/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { ContainerModule } from 'inversify';
import { registerActorElement, registerClassElement, registerInformationFlowElement } from '../../elements/index';

export const umlInformationFlowDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    registerClassElement(context, UMLDiagramType.INFORMATION_FLOW);
    registerActorElement(context, UMLDiagramType.INFORMATION_FLOW);
    registerInformationFlowElement(context, UMLDiagramType.INFORMATION_FLOW);
});
