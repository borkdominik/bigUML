// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
    isArtifact,
    isCommunicationPath,
    isDependency,
    isDeployment,
    isDeploymentModel,
    isDeploymentNode,
    isDeploymentPackage,
    isDeploymentSpecification,
    isDevice,
    isExecutionEnvironment,
    isGeneralization,
    isManifestation,
    isOperation,
    isParameter,
    isProperty
} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState, DiagramLanguageMetadata } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { DiagramLanguageMetadata as DiagramLanguageMetadataType } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { ArtifactPropertyPaletteHandler } from './elements/artifact.property-palette-handler.js';
import { CommunicationPathPropertyPaletteHandler } from './elements/communication-path.property-palette-handler.js';
import { DependencyPropertyPaletteHandler } from './elements/dependency.property-palette-handler.js';
import { DeploymentPropertyPaletteHandler } from './elements/deployment.property-palette-handler.js';
import { DeploymentModelPropertyPaletteHandler } from './elements/deployment-model.property-palette-handler.js';
import { DeploymentNodePropertyPaletteHandler } from './elements/deployment-node.property-palette-handler.js';
import { DeploymentPackagePropertyPaletteHandler } from './elements/deployment-package.property-palette-handler.js';
import { DeploymentSpecificationPropertyPaletteHandler } from './elements/deployment-specification.property-palette-handler.js';
import { DevicePropertyPaletteHandler } from './elements/device.property-palette-handler.js';
import { ExecutionEnvironmentPropertyPaletteHandler } from './elements/execution-environment.property-palette-handler.js';
import { GeneralizationPropertyPaletteHandler } from './elements/generalization.property-palette-handler.js';
import { ManifestationPropertyPaletteHandler } from './elements/manifestation.property-palette-handler.js';
import { OperationPropertyPaletteHandler } from './elements/operation.property-palette-handler.js';
import { ParameterPropertyPaletteHandler } from './elements/parameter.property-palette-handler.js';
import { PropertyPropertyPaletteHandler } from './elements/property.property-palette-handler.js';
@injectable()
export class RequestDeploymentPropertyPaletteActionHandler implements ActionHandler {
    actionKinds = [RequestPropertyPaletteAction.KIND];

    @inject(DiagramModelState)
    protected modelState!: DiagramModelState;

    @inject(DiagramLanguageMetadata)
    protected languageMetadata!: DiagramLanguageMetadataType;

    execute(action: RequestPropertyPaletteAction): MaybePromise<any[]> {
        try {
            if (!action.elementId) {
                return [SetPropertyPaletteAction.create()];
            }
            if (typeof action.elementId !== 'string' || action.elementId.endsWith('_refValue')) {
                return [SetPropertyPaletteAction.create()];
            }

            let semanticElement: any | undefined;
            try {
                semanticElement = this.modelState.index.findIdElement(action.elementId);
            } catch {
                return [SetPropertyPaletteAction.create()];
            }
            if (!semanticElement) {
                return [SetPropertyPaletteAction.create()];
            }

            const context = { semanticElement, languageMetadata: this.languageMetadata };

            const dataTypeChoices = (this.modelState.index.getAllDataTypes?.() ?? [])
                .filter((item: any) => !!item && !!item.__id && !!item.name)
                .map((item: any) => ({
                    label: item.name,
                    value: item.__id + '_refValue',
                    secondaryText: item.$type
                }));
            if (isGeneralization(semanticElement)) {
                return GeneralizationPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isProperty(semanticElement)) {
                return PropertyPropertyPaletteHandler.getPropertyPalette(context, dataTypeChoices);
            } else if (isOperation(semanticElement)) {
                return OperationPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isParameter(semanticElement)) {
                return ParameterPropertyPaletteHandler.getPropertyPalette(context, dataTypeChoices);
            } else if (isDependency(semanticElement)) {
                return DependencyPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isManifestation(semanticElement)) {
                return ManifestationPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isExecutionEnvironment(semanticElement)) {
                return ExecutionEnvironmentPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDeploymentSpecification(semanticElement)) {
                return DeploymentSpecificationPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isArtifact(semanticElement)) {
                return ArtifactPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDevice(semanticElement)) {
                return DevicePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDeploymentNode(semanticElement)) {
                return DeploymentNodePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDeploymentPackage(semanticElement)) {
                return DeploymentPackagePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDeploymentModel(semanticElement)) {
                return DeploymentModelPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDeployment(semanticElement)) {
                return DeploymentPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isCommunicationPath(semanticElement)) {
                return CommunicationPathPropertyPaletteHandler.getPropertyPalette(context);
            }

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
