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
    COMMUNICATION = 'COMMUNICATION',
    COMPONENT = 'COMPONENT',
    COMPOSITE = 'COMPOSITE',
    DEPLOYMENT = 'DEPLOYMENT',
    INTERACTION = 'INTERACTION',
    OBJECT = 'OBJECT',
    PACKAGE = 'PACKAGE',
    PROFILE = 'PROFILE',
    SEQUENCE = 'SEQUENCE',
    STATE_MACHINE = 'STATE_MACHINE',
    TIMING = 'TIMING',
    USE_CASE = 'USE_CASE'
}

export namespace UmlDiagramTypeUtil {
    export const supported: UmlDiagramType[] = [UmlDiagramType.CLASS, UmlDiagramType.COMMUNICATION];

    export function parseString(diagramType: string): UmlDiagramType {
        return Object.values(UmlDiagramType).find(u => u.toUpperCase() === diagramType.toUpperCase()) ?? UmlDiagramType.NONE;
    }
}
