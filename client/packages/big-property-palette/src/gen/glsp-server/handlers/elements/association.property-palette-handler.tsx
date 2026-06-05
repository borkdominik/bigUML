// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Association } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace AssociationPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Association>): SetPropertyPaletteAction[] {
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
                        propertyId='sourceMultiplicity'
                        text={context.semanticElement.sourceMultiplicity!}
                        label='Source Multiplicity'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='targetMultiplicity'
                        text={context.semanticElement.targetMultiplicity!}
                        label='Target Multiplicity'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='sourceName'
                        text={context.semanticElement.sourceName!}
                        label='Source Name'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='targetName'
                        text={context.semanticElement.targetName!}
                        label='Target Name'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='sourceAggregation'
                        choices={PropertyPaletteChoices.AGGREGATION}
                        choice={context.semanticElement.sourceAggregation!}
                        label='Aggregation Type'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='targetAggregation'
                        choices={PropertyPaletteChoices.AGGREGATION}
                        choice={context.semanticElement.targetAggregation!}
                        label='Aggregation Type'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={context.semanticElement.visibility!}
                        label='Visibility'
                    />
                </PropertyPalette>
            )
        ];
    }
}
