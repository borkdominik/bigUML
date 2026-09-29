// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Transition } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace TransitionPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Transition>): SetPropertyPaletteAction[] {
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
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={context.semanticElement.visibility!}
                        label='Visibility'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='kind'
                        choices={PropertyPaletteChoices.TRANSITION_KIND}
                        choice={context.semanticElement.kind!}
                        label='Transition Kind'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='sourcePoint'
                        choices={PropertyPaletteChoices.CONNECTION_POINT}
                        choice={context.semanticElement.sourcePoint!}
                        label='Source Point'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='targetPoint'
                        choices={PropertyPaletteChoices.CONNECTION_POINT}
                        choice={context.semanticElement.targetPoint!}
                        label='Target Point'
                    />
                </PropertyPalette>
            )
        ];
    }
}
