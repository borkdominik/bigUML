// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { ToolPaletteItemProvider } from '@eclipse-glsp/server';
import type { interfaces } from 'inversify';
import * as uuid from 'uuid';
import { UseCaseAstTypes, UseCaseDiagramEdgeTypes, UseCaseDiagramNodeTypes } from '../common/model-types/use-case-diagram-model-types.js';
import { UseCaseDiagramToolPaletteItemProvider } from './diagram/use-case/use-case-diagram-tool-palette-item-provider.js';
import {
    StateMachineAstTypes,
    StateMachineDiagramEdgeTypes,
    StateMachineDiagramNodeTypes
} from '../common/model-types/state-machine-diagram-model-types.js';
import { StateMachineDiagramToolPaletteItemProvider } from './diagram/state-machine/state-machine-diagram-tool-palette-item-provider.js';
import { PackageAstTypes, PackageDiagramEdgeTypes, PackageDiagramNodeTypes } from '../common/model-types/package-diagram-model-types.js';
import { PackageDiagramToolPaletteItemProvider } from './diagram/package/package-diagram-tool-palette-item-provider.js';
import {
    InformationFlowAstTypes,
    InformationFlowDiagramEdgeTypes,
    InformationFlowDiagramNodeTypes
} from '../common/model-types/information-flow-diagram-model-types.js';
import { InformationFlowDiagramToolPaletteItemProvider } from './diagram/information-flow/information-flow-diagram-tool-palette-item-provider.js';
import {
    DeploymentAstTypes,
    DeploymentDiagramEdgeTypes,
    DeploymentDiagramNodeTypes
} from '../common/model-types/deployment-diagram-model-types.js';
import { DeploymentDiagramToolPaletteItemProvider } from './diagram/deployment/deployment-diagram-tool-palette-item-provider.js';
import {
    CommunicationAstTypes,
    CommunicationDiagramEdgeTypes,
    CommunicationDiagramNodeTypes
} from '../common/model-types/communication-diagram-model-types.js';
import { CommunicationDiagramToolPaletteItemProvider } from './diagram/communication/communication-diagram-tool-palette-item-provider.js';
import { ClassAstTypes, ClassDiagramEdgeTypes, ClassDiagramNodeTypes } from '../common/model-types/class-diagram-model-types.js';
import { ClassDiagramToolPaletteItemProvider } from './diagram/class/class-diagram-tool-palette-item-provider.js';
import {
    ActivityAstTypes,
    ActivityDiagramEdgeTypes,
    ActivityDiagramNodeTypes
} from '../common/model-types/activity-diagram-model-types.js';
import { ActivityDiagramToolPaletteItemProvider } from './diagram/activity/activity-diagram-tool-palette-item-provider.js';

/** One diagram of the language and what serves it. */
export interface DiagramRegistration {
    /** The literal a model stores in `diagram.diagramType` - `CLASS`, `STATE_MACHINE`, ... */
    diagramType: string;
    /** The diagram's name as it prefixes its generated classes - `Class`, `StateMachine`, ... */
    name: string;
    /** The AST type of the diagram itself - `ClassDiagram`, `StateMachineDiagram`, ... */
    astType: string;
    /** The element type ids of every node of the diagram. */
    nodeTypeIds: string[];
    /** The element type ids of every edge of the diagram. */
    edgeTypeIds: string[];
    /** The AST type an element type id of the diagram is stored as. */
    convertToAst(elementTypeId: string): string;
    /** The element type id an element stored as `astType` is drawn as in the diagram. */
    convertToElementType(astType: string): string;
    toolPaletteItemProvider: interfaces.Newable<ToolPaletteItemProvider>;
}

/** Every diagram there is. Wiring that needs a per-diagram class iterates this rather than naming each. */
export const DIAGRAM_REGISTRY: readonly DiagramRegistration[] = [
    {
        diagramType: 'USE_CASE',
        name: 'UseCase',
        astType: 'UseCaseDiagram',
        nodeTypeIds: Object.values(UseCaseDiagramNodeTypes),
        edgeTypeIds: Object.values(UseCaseDiagramEdgeTypes),
        convertToAst: UseCaseAstTypes.convertToAst,
        convertToElementType: UseCaseAstTypes.convertToElementType,
        toolPaletteItemProvider: UseCaseDiagramToolPaletteItemProvider
    },
    {
        diagramType: 'STATE_MACHINE',
        name: 'StateMachine',
        astType: 'StateMachineDiagram',
        nodeTypeIds: Object.values(StateMachineDiagramNodeTypes),
        edgeTypeIds: Object.values(StateMachineDiagramEdgeTypes),
        convertToAst: StateMachineAstTypes.convertToAst,
        convertToElementType: StateMachineAstTypes.convertToElementType,
        toolPaletteItemProvider: StateMachineDiagramToolPaletteItemProvider
    },
    {
        diagramType: 'PACKAGE',
        name: 'Package',
        astType: 'PackageDiagram',
        nodeTypeIds: Object.values(PackageDiagramNodeTypes),
        edgeTypeIds: Object.values(PackageDiagramEdgeTypes),
        convertToAst: PackageAstTypes.convertToAst,
        convertToElementType: PackageAstTypes.convertToElementType,
        toolPaletteItemProvider: PackageDiagramToolPaletteItemProvider
    },
    {
        diagramType: 'INFORMATION_FLOW',
        name: 'InformationFlow',
        astType: 'InformationFlowDiagram',
        nodeTypeIds: Object.values(InformationFlowDiagramNodeTypes),
        edgeTypeIds: Object.values(InformationFlowDiagramEdgeTypes),
        convertToAst: InformationFlowAstTypes.convertToAst,
        convertToElementType: InformationFlowAstTypes.convertToElementType,
        toolPaletteItemProvider: InformationFlowDiagramToolPaletteItemProvider
    },
    {
        diagramType: 'DEPLOYMENT',
        name: 'Deployment',
        astType: 'DeploymentDiagram',
        nodeTypeIds: Object.values(DeploymentDiagramNodeTypes),
        edgeTypeIds: Object.values(DeploymentDiagramEdgeTypes),
        convertToAst: DeploymentAstTypes.convertToAst,
        convertToElementType: DeploymentAstTypes.convertToElementType,
        toolPaletteItemProvider: DeploymentDiagramToolPaletteItemProvider
    },
    {
        diagramType: 'COMMUNICATION',
        name: 'Communication',
        astType: 'CommunicationDiagram',
        nodeTypeIds: Object.values(CommunicationDiagramNodeTypes),
        edgeTypeIds: Object.values(CommunicationDiagramEdgeTypes),
        convertToAst: CommunicationAstTypes.convertToAst,
        convertToElementType: CommunicationAstTypes.convertToElementType,
        toolPaletteItemProvider: CommunicationDiagramToolPaletteItemProvider
    },
    {
        diagramType: 'CLASS',
        name: 'Class',
        astType: 'ClassDiagram',
        nodeTypeIds: Object.values(ClassDiagramNodeTypes),
        edgeTypeIds: Object.values(ClassDiagramEdgeTypes),
        convertToAst: ClassAstTypes.convertToAst,
        convertToElementType: ClassAstTypes.convertToElementType,
        toolPaletteItemProvider: ClassDiagramToolPaletteItemProvider
    },
    {
        diagramType: 'ACTIVITY',
        name: 'Activity',
        astType: 'ActivityDiagram',
        nodeTypeIds: Object.values(ActivityDiagramNodeTypes),
        edgeTypeIds: Object.values(ActivityDiagramEdgeTypes),
        convertToAst: ActivityAstTypes.convertToAst,
        convertToElementType: ActivityAstTypes.convertToElementType,
        toolPaletteItemProvider: ActivityDiagramToolPaletteItemProvider
    }
];

/** The diagram a model stores as `diagramType` - matched in any case, `CLASS` as well as `class`. */
export function findDiagramRegistration(diagramType: string | undefined): DiagramRegistration | undefined {
    return DIAGRAM_REGISTRY.find(diagram => diagram.diagramType === diagramType?.toUpperCase());
}

/** A new, empty model of the diagram - what a new file of it is written as. */
export function createEmptyDiagram(diagramType: string) {
    const diagram = findDiagramRegistration(diagramType);
    if (!diagram) {
        return undefined;
    }
    return {
        $type: 'Diagram' as const,
        diagram: {
            $type: diagram.astType,
            __id: `diagram_${uuid.v4()}`,
            diagramType: diagram.diagramType,
            entities: [],
            relations: []
        }
    };
}
