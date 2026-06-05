// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Generalization } from '@borkdominik-biguml/uml-model-server/grammar';
import { type GetPropertyPaletteHandlerContext, BoolProperty, PropertyPalette } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace GeneralizationPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Generalization>): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette
                    elementId={context.semanticElement.__id}
                    label={(context.semanticElement as any).name ?? context.semanticElement.$type}
                >
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isSubstitutable'
                        value={!!context.semanticElement.isSubstitutable}
                        label='isSubstitutable'
                    />
                </PropertyPalette>
            )
        ];
    }
}
