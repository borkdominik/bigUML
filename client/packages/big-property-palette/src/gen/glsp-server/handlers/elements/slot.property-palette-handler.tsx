// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { ChoiceProperty, PropertyPalette, ReferenceProperty, TextProperty } from '@borkdominik-biguml/big-property-palette/glsp-server';
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { type Slot } from '@borkdominik-biguml/uml-model-server/grammar';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';

export namespace SlotPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Slot, definingFeatureChoices: any): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <TextProperty elementId={semanticElement.__id} propertyId='name' text={semanticElement.name!} label='Name' />
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='definingFeature'
                        choices={definingFeatureChoices}
                        choice={
                            (semanticElement.definingFeature as any)?.ref?.__id
                                ? (semanticElement.definingFeature as any).ref.__id + '_refValue'
                                : ''
                        }
                        label='Defining Feature'
                    />
                    <ReferenceProperty
                        elementId={semanticElement.__id}
                        propertyId='values'
                        label='Values'
                        references={(semanticElement.values ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed literal_specification)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Literal Specification',
                                action: CreateNodeOperation.create(ClassDiagramNodeTypes.LITERAL_SPECIFICATION, {
                                    containerId: semanticElement.__id
                                })
                            }
                        ]}
                    />
                </PropertyPalette>
            )
        ];
    }
}
