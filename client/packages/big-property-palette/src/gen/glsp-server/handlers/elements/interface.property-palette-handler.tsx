// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import {
  CreateNodeOperation,
  DeleteElementOperation,
} from '@eclipse-glsp/server';
import { type Interface } from '@borkdominik-biguml/model-server/grammar';
import { ModelTypes } from '@borkdominik-biguml/uml-glsp-server/vscode';
import {
  PropertyPalette,
  ReferenceProperty,
  TextProperty,
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace InterfacePropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Interface,
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
            propertyId="properties"
            label="Properties"
            references={(semanticElement.properties ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed property)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              }))}
            creates={[
              {
                label: 'Create Property',
                action: CreateNodeOperation.create(ModelTypes.PROPERTY, {
                  containerId: semanticElement.__id,
                }),
              },
            ]}
          />
          <ReferenceProperty
            elementId={semanticElement.__id}
            propertyId="operations"
            label="Operations"
            references={(semanticElement.operations ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed operation)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              }))}
            creates={[
              {
                label: 'Create Operation',
                action: CreateNodeOperation.create(ModelTypes.OPERATION, {
                  containerId: semanticElement.__id,
                }),
              },
            ]}
          />
        </PropertyPalette>,
      ),
    ];
  }
}
