// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type StatePart } from '@borkdominik-biguml/uml-model-server/grammar';
import { type GetPropertyPaletteHandlerContext, PropertyPalette, TextProperty } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace StatePartPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<StatePart>): SetPropertyPaletteAction[] {
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
                        propertyId='trigger'
                        text={context.semanticElement.trigger!}
                        label='Trigger'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='guard'
                        text={context.semanticElement.guard!}
                        label='Guard'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='effect'
                        text={context.semanticElement.effect!}
                        label='Effect'
                    />
                </PropertyPalette>
            )
        ];
    }
}
