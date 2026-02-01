// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { LiteralSpecification } from '@borkdominik-biguml/model-server/grammar';
import { PropertyPalette } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace LiteralSpecificationPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: LiteralSpecification,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name!, 'Name')
          .text(semanticElement.__id, 'value', semanticElement.value!, 'Value')
          .build(),
      ),
    ];
  }
}
