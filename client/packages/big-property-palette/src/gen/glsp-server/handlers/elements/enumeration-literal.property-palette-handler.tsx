// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type EnumerationLiteral } from '@borkdominik-biguml/model-server/grammar';
import {
  ChoiceProperty,
  PropertyPalette,
  PropertyPaletteChoices,
  TextProperty,
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace EnumerationLiteralPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: EnumerationLiteral,
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
          <TextProperty
            elementId={semanticElement.__id}
            propertyId="value"
            text={semanticElement.value!}
            label="Value"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="visibility"
            choices={PropertyPaletteChoices.VISIBILITY}
            choice={semanticElement.visibility!}
            label="Visibility"
          />
        </PropertyPalette>,
      ),
    ];
  }
}
