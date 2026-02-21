// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import {
  CreateNodeOperation,
  DeleteElementOperation,
} from '@eclipse-glsp/server';
import { type InstanceSpecification } from '@borkdominik-biguml/model-server/grammar';
import { ModelTypes } from '@borkdominik-biguml/uml-glsp-server/vscode';
import {
  ChoiceProperty,
  PropertyPalette,
  PropertyPaletteChoices,
  ReferenceProperty,
  TextProperty,
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace InstanceSpecificationPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: InstanceSpecification,
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
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="visibility"
            choices={PropertyPaletteChoices.VISIBILITY}
            choice={semanticElement.visibility!}
            label="Visibility"
          />
          <ReferenceProperty
            elementId={semanticElement.__id}
            propertyId="slots"
            label="Slots"
            references={(semanticElement.slots ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed slot)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              }))}
            creates={[
              {
                label: 'Create Slot',
                action: CreateNodeOperation.create(ModelTypes.SLOT, {
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
