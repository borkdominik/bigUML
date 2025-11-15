// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';
import { Element } from '../../../../language-server/generated/ast.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace ElementPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Element,
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
