// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Note } from '@borkdominik-biguml/uml-model-server/grammar';
import { type GetPropertyPaletteHandlerContext, PropertyPalette, TextProperty } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace NotePropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Note>): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette
                    elementId={context.semanticElement.__id}
                    label={(context.semanticElement as any).name ?? context.semanticElement.$type}
                >
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='body'
                        text={context.semanticElement.body!}
                        label='Body'
                    />
                </PropertyPalette>
            )
        ];
    }
}
