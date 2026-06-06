// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import * as uuid from 'uuid';

export function getEmptyDiagram(diagramType: string) {
    switch (diagramType) {
        case 'use_case':
            return {
                $type: 'Diagram' as const,
                diagram: {
                    $type: 'UseCaseDiagram' as const,
                    __id: `diagram_${uuid.v4()}`,
                    diagramType: 'USE_CASE' as const,
                    entities: [],
                    relations: []
                },
                metaInfos: []
            };
        case 'state_machine':
            return {
                $type: 'Diagram' as const,
                diagram: {
                    $type: 'StateMachineDiagram' as const,
                    __id: `diagram_${uuid.v4()}`,
                    diagramType: 'STATE_MACHINE' as const,
                    entities: [],
                    relations: []
                },
                metaInfos: []
            };
        case 'package':
            return {
                $type: 'Diagram' as const,
                diagram: {
                    $type: 'PackageDiagram' as const,
                    __id: `diagram_${uuid.v4()}`,
                    diagramType: 'PACKAGE' as const,
                    entities: [],
                    relations: []
                },
                metaInfos: []
            };
        case 'information_flow':
            return {
                $type: 'Diagram' as const,
                diagram: {
                    $type: 'InformationFlowDiagram' as const,
                    __id: `diagram_${uuid.v4()}`,
                    diagramType: 'INFORMATION_FLOW' as const,
                    entities: [],
                    relations: []
                },
                metaInfos: []
            };
        case 'deployment':
            return {
                $type: 'Diagram' as const,
                diagram: {
                    $type: 'DeploymentDiagram' as const,
                    __id: `diagram_${uuid.v4()}`,
                    diagramType: 'DEPLOYMENT' as const,
                    entities: [],
                    relations: []
                },
                metaInfos: []
            };
        case 'communication':
            return {
                $type: 'Diagram' as const,
                diagram: {
                    $type: 'CommunicationDiagram' as const,
                    __id: `diagram_${uuid.v4()}`,
                    diagramType: 'COMMUNICATION' as const,
                    entities: [],
                    relations: []
                },
                metaInfos: []
            };
        case 'class':
            return {
                $type: 'Diagram' as const,
                diagram: {
                    $type: 'ClassDiagram' as const,
                    __id: `diagram_${uuid.v4()}`,
                    diagramType: 'CLASS' as const,
                    entities: [],
                    relations: []
                },
                metaInfos: []
            };
        case 'activity':
            return {
                $type: 'Diagram' as const,
                diagram: {
                    $type: 'ActivityDiagram' as const,
                    __id: `diagram_${uuid.v4()}`,
                    diagramType: 'ACTIVITY' as const,
                    entities: [],
                    relations: []
                },
                metaInfos: []
            };
        default:
            return undefined;
    }
}
