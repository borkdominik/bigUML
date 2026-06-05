// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Property } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    BoolProperty,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace PropertyPropertyPaletteHandler {
    export function getPropertyPalette(
        context: GetPropertyPaletteHandlerContext<Property>,
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
                        propertyId='isDerived'
                        value={!!context.semanticElement.isDerived}
                        label='isDerived'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isOrdered'
                        value={!!context.semanticElement.isOrdered}
                        label='isOrdered'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isStatic'
                        value={!!context.semanticElement.isStatic}
                        label='isStatic'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isDerivedUnion'
                        value={!!context.semanticElement.isDerivedUnion}
                        label='isDerivedUnion'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isReadOnly'
                        value={!!context.semanticElement.isReadOnly}
                        label='isReadOnly'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isNavigable'
                        value={!!context.semanticElement.isNavigable}
                        label='isNavigable'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isUnique'
                        value={!!context.semanticElement.isUnique}
                        label='isUnique'
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
                        propertyId='multiplicity'
                        text={context.semanticElement.multiplicity!}
                        label='Multiplicity'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='propertyType'
                        choices={dataTypeChoices}
                        choice={
                            (context.semanticElement.propertyType as any)?.ref?.__id
                                ? (context.semanticElement.propertyType as any).ref.__id + '_refValue'
                                : ''
                        }
                        label='Property Type'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='aggregation'
                        choices={PropertyPaletteChoices.AGGREGATION}
                        choice={context.semanticElement.aggregation!}
                        label='Aggregation Type'
                    />
                </PropertyPalette>
            )
        ];
    }
}
