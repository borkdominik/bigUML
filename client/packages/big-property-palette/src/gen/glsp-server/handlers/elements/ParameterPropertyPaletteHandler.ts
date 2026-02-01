// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { Parameter } from '@borkdominik-biguml/model-server/grammar';
import { PropertyPalette } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace ParameterPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Parameter,
    dataTypeChoices: any,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name!, 'Name')
          .bool(
            semanticElement.__id,
            'isException',
            !!semanticElement.isException,
            'isException',
          )
          .bool(
            semanticElement.__id,
            'isStream',
            !!semanticElement.isStream,
            'isStream',
          )
          .bool(
            semanticElement.__id,
            'isOrdered',
            !!semanticElement.isOrdered,
            'isOrdered',
          )
          .bool(
            semanticElement.__id,
            'isUnique',
            !!semanticElement.isUnique,
            'isUnique',
          )
          .choice(
            semanticElement.__id,
            'direction',
            PropertyPalette.DEFAULT_PARAMETER_DIRECTION_CHOICES,
            semanticElement.direction!,
            'Parameter Direction',
          )
          .choice(
            semanticElement.__id,
            'effect',
            PropertyPalette.DEFAULT_EFFECT_CHOICES,
            semanticElement.effect!,
            'Effect Type',
          )
          .choice(
            semanticElement.__id,
            'visibility',
            PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
            semanticElement.visibility!,
            'Visibility',
          )
          .choice(
            semanticElement.__id,
            'parameterType',
            dataTypeChoices,
            (semanticElement.parameterType as any)?.ref?.__id
              ? (semanticElement.parameterType as any).ref.__id + '_refValue'
              : '',
            'Parameter Type',
          )
          .text(
            semanticElement.__id,
            'multiplicity',
            semanticElement.multiplicity!,
            'Multiplicity',
          )
          .build(),
      ),
    ];
  }
}
