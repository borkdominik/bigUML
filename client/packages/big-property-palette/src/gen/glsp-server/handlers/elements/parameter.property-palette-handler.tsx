// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Parameter } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    BoolProperty,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace ParameterPropertyPaletteHandler {
    export function getPropertyPalette(
        context: GetPropertyPaletteHandlerContext<Parameter>,
        dataTypeChoices: any
    ): SetPropertyPaletteAction[] {
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
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isException'
                        value={!!context.semanticElement.isException}
                        label='isException'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isStream'
                        value={!!context.semanticElement.isStream}
                        label='isStream'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isOrdered'
                        value={!!context.semanticElement.isOrdered}
                        label='isOrdered'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isUnique'
                        value={!!context.semanticElement.isUnique}
                        label='isUnique'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='direction'
                        choices={PropertyPaletteChoices.PARAMETER_DIRECTION}
                        choice={context.semanticElement.direction!}
                        label='Parameter Direction'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='effect'
                        choices={PropertyPaletteChoices.EFFECT}
                        choice={context.semanticElement.effect!}
                        label='Effect Type'
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
                        propertyId='parameterType'
                        choices={dataTypeChoices}
                        choice={
                            (context.semanticElement.parameterType as any)?.ref?.__id
                                ? (context.semanticElement.parameterType as any).ref.__id + '_refValue'
                                : ''
                        }
                        label='Parameter Type'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='multiplicity'
                        text={context.semanticElement.multiplicity!}
                        label='Multiplicity'
                    />
                </PropertyPalette>
            )
        ];
    }
}
