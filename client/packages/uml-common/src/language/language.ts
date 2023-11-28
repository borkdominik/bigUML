/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
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
    USE_CASE = 'USE_CASE',
    INFORMATION_FLOW = 'INFORMATION_FLOW'
}

export namespace UmlDiagramTypeUtil {
    export const supported: UmlDiagramType[] = [
        UmlDiagramType.ACTIVITY,
        UmlDiagramType.CLASS,
        UmlDiagramType.COMMUNICATION,
        UmlDiagramType.DEPLOYMENT,
        UmlDiagramType.INFORMATION_FLOW,
        UmlDiagramType.PACKAGE,
        UmlDiagramType.SEQUENCE,
        UmlDiagramType.STATE_MACHINE,
        UmlDiagramType.USE_CASE
    ];

    export function parseString(diagramType: string): UmlDiagramType {
        return Object.values(UmlDiagramType).find(u => u.toUpperCase() === diagramType.toUpperCase()) ?? UmlDiagramType.NONE;
    }
}
