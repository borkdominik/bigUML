// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type LiteralSpecification } from '@borkdominik-biguml/uml-model-server/grammar';
import { type GetPropertyPaletteHandlerContext, PropertyPalette, TextProperty } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace LiteralSpecificationPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<LiteralSpecification>): SetPropertyPaletteAction[] {
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
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='value'
                        text={context.semanticElement.value!}
                        label='Value'
                    />
                </PropertyPalette>
            )
        ];
    }
}
