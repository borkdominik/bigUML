// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import {
  CreateNodeOperation,
  DeleteElementOperation,
} from '@eclipse-glsp/server';
import { Enumeration } from '@borkdominik-biguml/model-server/grammar';
import { ModelTypes } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { PropertyPalette } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace EnumerationPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Enumeration,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name!, 'Name')
          .reference(
            semanticElement.__id,
            'values',
            'Values',
            (semanticElement.values ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed enumeration_literal)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              })),
            [
              {
                label: 'Create Enumeration Literal',
                action: CreateNodeOperation.create(
                  ModelTypes.ENUMERATION_LITERAL,
                  { containerId: semanticElement.__id },
                ),
              },
            ],
          )
          .build(),
      ),
    ];
  }
}
