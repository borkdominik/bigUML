// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import {
  CreateNodeOperation,
  DeleteElementOperation,
} from '@eclipse-glsp/server';
import { InstanceSpecification } from '@borkdominik-biguml/model-server/grammar';
import { ModelTypes } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { PropertyPalette } from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace InstanceSpecificationPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: InstanceSpecification,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name!, 'Name')
          .choice(
            semanticElement.__id,
            'visibility',
            PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
            semanticElement.visibility!,
            'Visibility',
          )
          .reference(
            semanticElement.__id,
            'slots',
            'Slots',
            (semanticElement.slots ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed slot)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              })),
            [
              {
                label: 'Create Slot',
                action: CreateNodeOperation.create(ModelTypes.SLOT, {
                  containerId: semanticElement.__id,
                }),
              },
            ],
          )
          .build(),
      ),
    ];
  }
}
