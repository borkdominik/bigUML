// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type LiteralSpecification } from '@borkdominik-biguml/uml-model-server/grammar';
import { PropertyPalette, TextProperty } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace LiteralSpecificationPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: LiteralSpecification): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <TextProperty elementId={semanticElement.__id} propertyId='name' text={semanticElement.name!} label='Name' />
                    <TextProperty elementId={semanticElement.__id} propertyId='value' text={semanticElement.value!} label='Value' />
                </PropertyPalette>
            )
        ];
    }
}
