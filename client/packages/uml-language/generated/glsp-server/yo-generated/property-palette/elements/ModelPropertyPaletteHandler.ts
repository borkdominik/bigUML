// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';
import { Model } from '../../../../language-server/generated/ast.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace ModelPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Model,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)

          .build(),
      ),
    ];
  }
}
