// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Generalization } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    BoolProperty,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace GeneralizationPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Generalization): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <BoolProperty
                        elementId={semanticElement.__id}
                        propertyId='isSubstitutable'
                        value={!!semanticElement.isSubstitutable}
                        label='isSubstitutable'
                    />
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
