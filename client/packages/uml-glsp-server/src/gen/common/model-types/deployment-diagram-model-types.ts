// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DefaultTypes } from '@eclipse-glsp/server';
import { representationTypeId } from '../../../env/common/model/model-type-utils.js';
import { AstTypeUtils } from '../../../env/common/model/model-type-utils.js';

export namespace DeploymentDiagramNodeTypes {
    export const ARTIFACT = representationTypeId('Deployment', DefaultTypes.NODE, 'Artifact');
    export const DEPLOYMENT_SPECIFICATION = representationTypeId('Deployment', DefaultTypes.NODE, 'DeploymentSpecification');
    export const DEVICE = representationTypeId('Deployment', DefaultTypes.NODE, 'Device');
    export const EXECUTION_ENVIRONMENT = representationTypeId('Deployment', DefaultTypes.NODE, 'ExecutionEnvironment');
    export const DEPLOYMENT_MODEL = representationTypeId('Deployment', DefaultTypes.NODE, 'DeploymentModel');
    export const DEPLOYMENT_NODE = representationTypeId('Deployment', DefaultTypes.NODE, 'DeploymentNode');
    export const DEPLOYMENT_PACKAGE = representationTypeId('Deployment', DefaultTypes.NODE, 'DeploymentPackage');
    export const PROPERTY = representationTypeId('Deployment', DefaultTypes.NODE, 'Property');
    export const OPERATION = representationTypeId('Deployment', DefaultTypes.NODE, 'Operation');
    export const PARAMETER = representationTypeId('Deployment', DefaultTypes.NODE, 'Parameter');
}

export namespace DeploymentDiagramEdgeTypes {
    export const COMMUNICATION_PATH = representationTypeId('Deployment', DefaultTypes.EDGE, 'CommunicationPath');
    export const DEPENDENCY = representationTypeId('Deployment', DefaultTypes.EDGE, 'Dependency');
    export const MANIFESTATION = representationTypeId('Deployment', DefaultTypes.EDGE, 'Manifestation');
    export const DEPLOYMENT = representationTypeId('Deployment', DefaultTypes.EDGE, 'Deployment');
    export const GENERALIZATION = representationTypeId('Deployment', DefaultTypes.EDGE, 'Generalization');
}

export namespace DeploymentDiagramModelTypes {
    // re-export nodes
    export const ARTIFACT = DeploymentDiagramNodeTypes.ARTIFACT;
    export const DEPLOYMENT_SPECIFICATION = DeploymentDiagramNodeTypes.DEPLOYMENT_SPECIFICATION;
    export const DEVICE = DeploymentDiagramNodeTypes.DEVICE;
    export const EXECUTION_ENVIRONMENT = DeploymentDiagramNodeTypes.EXECUTION_ENVIRONMENT;
    export const DEPLOYMENT_MODEL = DeploymentDiagramNodeTypes.DEPLOYMENT_MODEL;
    export const DEPLOYMENT_NODE = DeploymentDiagramNodeTypes.DEPLOYMENT_NODE;
    export const DEPLOYMENT_PACKAGE = DeploymentDiagramNodeTypes.DEPLOYMENT_PACKAGE;
    export const PROPERTY = DeploymentDiagramNodeTypes.PROPERTY;
    export const OPERATION = DeploymentDiagramNodeTypes.OPERATION;
    export const PARAMETER = DeploymentDiagramNodeTypes.PARAMETER;

    // re-export edges
    export const COMMUNICATION_PATH = DeploymentDiagramEdgeTypes.COMMUNICATION_PATH;
    export const DEPENDENCY = DeploymentDiagramEdgeTypes.DEPENDENCY;
    export const MANIFESTATION = DeploymentDiagramEdgeTypes.MANIFESTATION;
    export const DEPLOYMENT = DeploymentDiagramEdgeTypes.DEPLOYMENT;
    export const GENERALIZATION = DeploymentDiagramEdgeTypes.GENERALIZATION;
}

export namespace DeploymentAstTypes {
    const typeMap: Record<string, string> = {
        Artifact: DeploymentDiagramModelTypes.ARTIFACT,
        DeploymentSpecification: DeploymentDiagramModelTypes.DEPLOYMENT_SPECIFICATION,
        Device: DeploymentDiagramModelTypes.DEVICE,
        ExecutionEnvironment: DeploymentDiagramModelTypes.EXECUTION_ENVIRONMENT,
        DeploymentModel: DeploymentDiagramModelTypes.DEPLOYMENT_MODEL,
        DeploymentNode: DeploymentDiagramModelTypes.DEPLOYMENT_NODE,
        DeploymentPackage: DeploymentDiagramModelTypes.DEPLOYMENT_PACKAGE,
        Property: DeploymentDiagramModelTypes.PROPERTY,
        Operation: DeploymentDiagramModelTypes.OPERATION,
        Parameter: DeploymentDiagramModelTypes.PARAMETER,
        CommunicationPath: DeploymentDiagramModelTypes.COMMUNICATION_PATH,
        Dependency: DeploymentDiagramModelTypes.DEPENDENCY,
        Manifestation: DeploymentDiagramModelTypes.MANIFESTATION,
        Deployment: DeploymentDiagramModelTypes.DEPLOYMENT,
        Generalization: DeploymentDiagramModelTypes.GENERALIZATION
    };

    export function convertToAst(elementId: string): string {
        return AstTypeUtils.stripPrefix(elementId);
    }

    export function convertToElementType(astType: string): string {
        const elementType = typeMap[astType];
        if (!elementType) {
            throw new Error(`[DeploymentAstTypes] No element type found for AST type '${astType}'`);
        }
        return elementType;
    }
}
