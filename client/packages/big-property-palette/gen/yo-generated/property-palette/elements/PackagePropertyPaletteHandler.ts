// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/uml-protocol';
import { Package } from '@borkdominik-biguml/model-server/grammar';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace PackagePropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Package,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
          .text(semanticElement.__id, 'uri', semanticElement.uri, 'Uri')
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
