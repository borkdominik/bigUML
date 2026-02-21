// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import {
  CreateNodeOperation,
  DeleteElementOperation,
} from '@eclipse-glsp/server';
import { type Enumeration } from '@borkdominik-biguml/model-server/grammar';
import { ModelTypes } from '@borkdominik-biguml/uml-glsp-server/vscode';
import {
  PropertyPalette,
  ReferenceProperty,
  TextProperty,
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace EnumerationPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Enumeration,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        <PropertyPalette
          elementId={semanticElement.__id}
          label={(semanticElement as any).name ?? semanticElement.$type}
        >
          <TextProperty
            elementId={semanticElement.__id}
            propertyId="name"
            text={semanticElement.name!}
            label="Name"
          />
          <ReferenceProperty
            elementId={semanticElement.__id}
            propertyId="values"
            label="Values"
            references={(semanticElement.values ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed enumeration_literal)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              }))}
            creates={[
              {
                label: 'Create Enumeration Literal',
                action: CreateNodeOperation.create(
                  ModelTypes.ENUMERATION_LITERAL,
                  { containerId: semanticElement.__id },
                ),
              },
            ]}
          />
        </PropertyPalette>,
      ),
    ];
  }
}
