// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type PrimitiveType } from '@borkdominik-biguml/uml-model-server/grammar';
import { PropertyPalette, TextProperty } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace PrimitiveTypePropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: PrimitiveType): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <TextProperty elementId={semanticElement.__id} propertyId='name' text={semanticElement.name!} label='Name' />
                </PropertyPalette>
            )
        ];
    }
}
