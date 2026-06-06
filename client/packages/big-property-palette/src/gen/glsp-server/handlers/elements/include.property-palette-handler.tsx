// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Include } from '@borkdominik-biguml/uml-model-server/grammar';
import { type GetPropertyPaletteHandlerContext, PropertyPalette } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace IncludePropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Include>): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette
                    elementId={context.semanticElement.__id}
                    label={(context.semanticElement as any).name ?? context.semanticElement.$type}
                ></PropertyPalette>
            )
        ];
    }
}
