/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramTypeUtil, UmlLanguageEnvironment } from '@borkdominik-biguml/uml-common';
import { GLSPDiagramLanguage } from '@eclipse-glsp/theia-integration';

export const UTDiagramLanguage: GLSPDiagramLanguage = {
    contributionId: 'uml',
    label: 'UML diagram',
    diagramType: 'umldiagram',
    iconClass: 'codicon codicon-type-hierarchy-sub',
    fileExtensions: ['.uml']
};

export const UTLanguageEnvironment: UmlLanguageEnvironment = {
    supportedTypes: UmlDiagramTypeUtil.supported
};
