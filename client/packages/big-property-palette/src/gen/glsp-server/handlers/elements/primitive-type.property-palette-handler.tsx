// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type PrimitiveType } from '@borkdominik-biguml/uml-model-server/grammar';
import { type GetPropertyPaletteHandlerContext, PropertyPalette, TextProperty } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace PrimitiveTypePropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<PrimitiveType>): SetPropertyPaletteAction[] {
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
                </PropertyPalette>
            )
        ];
    }
}
