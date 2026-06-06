// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { type Activity } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace ActivityPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Activity>): SetPropertyPaletteAction[] {
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
                        propertyId='partitions'
                        label='Partitions'
                        references={(context.semanticElement.partitions ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed activity_partition)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Activity Partition',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('ActivityPartition'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='nodes'
                        label='Nodes'
                        references={(context.semanticElement.nodes ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed node)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[]}
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='edges'
                        label='Edges'
                        references={(context.semanticElement.edges ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed control_flow)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Control Flow',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('ControlFlow'), {
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
