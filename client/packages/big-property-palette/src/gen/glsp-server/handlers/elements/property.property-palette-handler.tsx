// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Property } from '@borkdominik-biguml/model-server/grammar';
import {
  BoolProperty,
  ChoiceProperty,
  PropertyPalette,
  PropertyPaletteChoices,
  TextProperty,
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace PropertyPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Property,
    dataTypeChoices: any,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        <PropertyPalette
          elementId={semanticElement.__id}
          label={(semanticElement as any).name ?? semanticElement.$type}
        >
          <TextProperty
            elementId={semanticElement.__id}
            propertyId="name"
            text={semanticElement.name!}
            label="Name"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isDerived"
            value={!!semanticElement.isDerived}
            label="isDerived"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isOrdered"
            value={!!semanticElement.isOrdered}
            label="isOrdered"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isStatic"
            value={!!semanticElement.isStatic}
            label="isStatic"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isDerivedUnion"
            value={!!semanticElement.isDerivedUnion}
            label="isDerivedUnion"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isReadOnly"
            value={!!semanticElement.isReadOnly}
            label="isReadOnly"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isUnique"
            value={!!semanticElement.isUnique}
            label="isUnique"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="visibility"
            choices={PropertyPaletteChoices.VISIBILITY}
            choice={semanticElement.visibility!}
            label="Visibility"
          />
          <TextProperty
            elementId={semanticElement.__id}
            propertyId="multiplicity"
            text={semanticElement.multiplicity!}
            label="Multiplicity"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="propertyType"
            choices={dataTypeChoices}
            choice={
              (semanticElement.propertyType as any)?.ref?.__id
                ? (semanticElement.propertyType as any).ref.__id + '_refValue'
                : ''
            }
            label="Property Type"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="aggregation"
            choices={PropertyPaletteChoices.AGGREGATION}
            choice={semanticElement.aggregation!}
            label="Aggregation Type"
          />
        </PropertyPalette>,
      ),
    ];
  }
}
