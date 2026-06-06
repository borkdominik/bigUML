// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Relation } from '@borkdominik-biguml/uml-model-server/grammar';
import { type GetPropertyPaletteHandlerContext, PropertyPalette } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace RelationPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Relation>): SetPropertyPaletteAction[] {
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
