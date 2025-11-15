// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';
import {
  CreateNodeOperation,
  DeleteElementOperation,
} from '@eclipse-glsp/server';
import { Interface } from '../../../../language-server/generated/ast.js';
import { ModelTypes } from '../../../../glsp-server/util/model-types.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace InterfacePropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Interface,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
          .reference(
            semanticElement.__id,
            'properties',
            'Properties',
            (semanticElement.properties ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed property)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              })),
            [
              {
                label: 'Create Property',
                action: CreateNodeOperation.create(ModelTypes.PROPERTY, {
                  containerId: semanticElement.__id,
                }),
              },
            ],
          )
          .reference(
            semanticElement.__id,
            'operations',
            'Operations',
            (semanticElement.operations ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed operation)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              })),
            [
              {
                label: 'Create Operation',
                action: CreateNodeOperation.create(ModelTypes.OPERATION, {
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
