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
    registerActorElement,
    registerAssociationElement,
    registerExtendElement,
    registerGeneralizationElement,
    registerIncludeElement,
    registerPropertyElement,
    registerSubjectElement,
    registerUseCaseElement
} from '../../elements/index';

export const umlUseCaseDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    registerActorElement(context, UmlDiagramType.USE_CASE);
    registerAssociationElement(context, UmlDiagramType.USE_CASE);
    registerExtendElement(context, UmlDiagramType.USE_CASE);
    registerGeneralizationElement(context, UmlDiagramType.USE_CASE);
    registerIncludeElement(context, UmlDiagramType.USE_CASE);
    registerPropertyElement(context, UmlDiagramType.USE_CASE);
    registerSubjectElement(context, UmlDiagramType.USE_CASE);
    registerUseCaseElement(context, UmlDiagramType.USE_CASE);
});
