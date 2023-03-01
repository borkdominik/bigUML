/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/

export enum UmlDiagramType {
    NONE = '',
    ACTIVITY = 'ACTIVITY',
    CLASS = 'CLASS',
    COMPONENT = 'COMPONENT',
    DEPLOYMENT = 'DEPLOYMENT',
    PACKAGE = 'PACKAGE',
    SEQUENCE = 'SEQUENCE',
    STATEMACHINE = 'STATEMACHINE',
    USECASE = 'USECASE',
    OBJECT = 'OBJECT',
    COMMUNICATION = 'COMMUNICATION'
}

export function parseDiagramType(diagramType: string): UmlDiagramType {
    switch (diagramType.toLowerCase()) {
        case 'class':
            return UmlDiagramType.CLASS;
        case 'communication':
            return UmlDiagramType.COMMUNICATION;
        case 'activity':
            return UmlDiagramType.ACTIVITY;
        case 'component':
            return UmlDiagramType.COMPONENT;
        case 'deployment':
            return UmlDiagramType.DEPLOYMENT;
        case 'package':
            return UmlDiagramType.PACKAGE;
        case 'sequence':
            return UmlDiagramType.SEQUENCE;
        case 'statemachine':
            return UmlDiagramType.STATEMACHINE;
        case 'usecase':
            return UmlDiagramType.USECASE;
        case 'object':
            return UmlDiagramType.OBJECT;
    }
    return UmlDiagramType.NONE;
}
