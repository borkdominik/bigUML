/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { GLSPDiagramLanguage } from '@eclipse-glsp/theia-integration';
import { UmlDiagramType, UmlLanguageEnvironment } from '@eclipsesource/uml-common';

export const UTDiagramLanguage: GLSPDiagramLanguage = {
    contributionId: 'uml',
    label: 'UML diagram',
    diagramType: 'umldiagram',
    iconClass: 'codicon codicon-type-hierarchy-sub',
    fileExtensions: ['.uml']
};

export const UTLanguageEnvironment: UmlLanguageEnvironment = {
    supportedTypes: UmlDiagramType.all
};
