// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type ElementImport } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace ElementImportPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: ElementImport): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <TextProperty elementId={semanticElement.__id} propertyId='alias' text={semanticElement.alias!} label='Alias' />
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={semanticElement.visibility!}
                        label='Visibility'
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
