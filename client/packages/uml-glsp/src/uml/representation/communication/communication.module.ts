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
import { registerInteractionElement, registerLifelineElement, registerMessageElement } from '../../elements/index';

export const umlCommunicationDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    registerInteractionElement(context, UMLDiagramType.COMMUNICATION);
    registerLifelineElement(context, UMLDiagramType.COMMUNICATION);
    registerMessageElement(context, UMLDiagramType.COMMUNICATION);
});
