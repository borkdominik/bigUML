// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Relation } from '@borkdominik-biguml/uml-model-server/grammar';
import { ChoiceProperty, PropertyPalette, PropertyPaletteChoices } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace RelationPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Relation): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='relationType'
                        choices={PropertyPaletteChoices.RELATION_TYPE}
                        choice={semanticElement.relationType!}
                        label='Relation Type'
                    />
                </PropertyPalette>
            )
        ];
    }
}
