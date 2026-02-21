// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type Parameter } from '@borkdominik-biguml/model-server/grammar';
import {
  BoolProperty,
  ChoiceProperty,
  PropertyPalette,
  PropertyPaletteChoices,
  TextProperty,
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace ParameterPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Parameter,
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
            propertyId="isException"
            value={!!semanticElement.isException}
            label="isException"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isStream"
            value={!!semanticElement.isStream}
            label="isStream"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isOrdered"
            value={!!semanticElement.isOrdered}
            label="isOrdered"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isUnique"
            value={!!semanticElement.isUnique}
            label="isUnique"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="direction"
            choices={PropertyPaletteChoices.PARAMETER_DIRECTION}
            choice={semanticElement.direction!}
            label="Parameter Direction"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="effect"
            choices={PropertyPaletteChoices.EFFECT}
            choice={semanticElement.effect!}
            label="Effect Type"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="visibility"
            choices={PropertyPaletteChoices.VISIBILITY}
            choice={semanticElement.visibility!}
            label="Visibility"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="parameterType"
            choices={dataTypeChoices}
            choice={
              (semanticElement.parameterType as any)?.ref?.__id
                ? (semanticElement.parameterType as any).ref.__id + '_refValue'
                : ''
            }
            label="Parameter Type"
          />
          <TextProperty
            elementId={semanticElement.__id}
            propertyId="multiplicity"
            text={semanticElement.multiplicity!}
            label="Multiplicity"
          />
        </PropertyPalette>,
      ),
    ];
  }
}
