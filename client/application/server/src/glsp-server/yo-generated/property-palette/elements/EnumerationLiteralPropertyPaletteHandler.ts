// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';
import { EnumerationLiteral } from '../../../../language-server/generated/ast.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace EnumerationLiteralPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: EnumerationLiteral,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
          .text(semanticElement.__id, 'value', semanticElement.value, 'Value')
          .choice(
            semanticElement.__id,
            'visibility',
            PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
            semanticElement.visibility,
            'Visibility',
          )
          .build(),
      ),
    ];
  }
}
