// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { type State } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace StatePropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<State>): SetPropertyPaletteAction[] {
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
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='parts'
                        label='Parts'
                        references={(context.semanticElement.parts ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed state_part)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create State Part',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('StatePart'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='partsHeight'
                        text={context.semanticElement.partsHeight !== undefined ? String(context.semanticElement.partsHeight) : ''}
                        label='Parts Height'
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
                        propertyId='regions'
                        label='Regions'
                        references={(context.semanticElement.regions ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed region)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Region',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('Region'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='regionHeight'
                        text={context.semanticElement.regionHeight !== undefined ? String(context.semanticElement.regionHeight) : ''}
                        label='Region Height'
                    />
                </PropertyPalette>
            )
        ];
    }
}
