// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type ControlFlow } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace ControlFlowPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<ControlFlow>): SetPropertyPaletteAction[] {
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
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={context.semanticElement.visibility!}
                        label='Visibility'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='guard'
                        text={context.semanticElement.guard!}
                        label='Guard'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='weight'
                        text={String(context.semanticElement.weight)!}
                        label='Weight'
                    />
                </PropertyPalette>
            )
        ];
    }
}
