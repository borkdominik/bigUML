// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Composition } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace CompositionPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Composition): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <TextProperty elementId={semanticElement.__id} propertyId='name' text={semanticElement.name!} label='Name' />
                    <TextProperty
                        elementId={semanticElement.__id}
                        propertyId='sourceMultiplicity'
                        text={semanticElement.sourceMultiplicity!}
                        label='Source Multiplicity'
                    />
                    <TextProperty
                        elementId={semanticElement.__id}
                        propertyId='targetMultiplicity'
                        text={semanticElement.targetMultiplicity!}
                        label='Target Multiplicity'
                    />
                    <TextProperty
                        elementId={semanticElement.__id}
                        propertyId='sourceName'
                        text={semanticElement.sourceName!}
                        label='Source Name'
                    />
                    <TextProperty
                        elementId={semanticElement.__id}
                        propertyId='targetName'
                        text={semanticElement.targetName!}
                        label='Target Name'
                    />
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='sourceAggregation'
                        choices={PropertyPaletteChoices.AGGREGATION_TYPE}
                        choice={semanticElement.sourceAggregation!}
                        label='Aggregation Type'
                    />
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='targetAggregation'
                        choices={PropertyPaletteChoices.AGGREGATION_TYPE}
                        choice={semanticElement.targetAggregation!}
                        label='Aggregation Type'
                    />
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={semanticElement.visibility!}
                        label='Visibility'
                    />
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='relationType'
                        choices={PropertyPaletteChoices.RELATION_TYPE}
                        choice={semanticElement.relationType!}
                        label='Relation Type'
                    />
                </PropertyPalette>
            )
        ];
    }
}
