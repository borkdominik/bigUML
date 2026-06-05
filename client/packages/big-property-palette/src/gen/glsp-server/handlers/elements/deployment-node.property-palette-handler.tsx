// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { type DeploymentNode } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace DeploymentNodePropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<DeploymentNode>): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette
                    elementId={context.semanticElement.__id}
                    label={(context.semanticElement as any).name ?? context.semanticElement.$type}
                >
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='name'
                        text={context.semanticElement.name!}
                        label='Name'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={context.semanticElement.visibility!}
                        label='Visibility'
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='nestedNodes'
                        label='Nested Nodes'
                        references={(context.semanticElement.nestedNodes ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed deployment_node)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Deployment Node',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('DeploymentNode'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='artifacts'
                        label='Artifacts'
                        references={(context.semanticElement.artifacts ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed artifact)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Artifact',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('Artifact'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='devices'
                        label='Devices'
                        references={(context.semanticElement.devices ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed device)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Device',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('Device'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='deploymentSpecifications'
                        label='Deployment Specifications'
                        references={(context.semanticElement.deploymentSpecifications ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed deployment_specification)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Deployment Specification',
                                action: CreateNodeOperation.create(
                                    context.languageMetadata.convertToElementType('DeploymentSpecification'),
                                    { containerId: context.semanticElement.__id }
                                )
                            }
                        ]}
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='executionEnvironments'
                        label='Execution Environments'
                        references={(context.semanticElement.executionEnvironments ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed execution_environment)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Execution Environment',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('ExecutionEnvironment'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                </PropertyPalette>
            )
        ];
    }
}
