// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/uml-protocol';
import { PrimitiveType } from '@borkdominik-biguml/model-server/grammar';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace PrimitiveTypePropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: PrimitiveType,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
          .build(),
      ),
    ];
  }
}
