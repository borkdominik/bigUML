// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import {
  CreateNodeOperation,
  DeleteElementOperation,
} from '@eclipse-glsp/server';
import { type Operation } from '@borkdominik-biguml/model-server/grammar';
import { ModelTypes } from '@borkdominik-biguml/uml-glsp-server/vscode';
import {
  BoolProperty,
  ChoiceProperty,
  PropertyPalette,
  PropertyPaletteChoices,
  ReferenceProperty,
  TextProperty,
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace OperationPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Operation,
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
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isAbstract"
            value={!!semanticElement.isAbstract}
            label="isAbstract"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isStatic"
            value={!!semanticElement.isStatic}
            label="isStatic"
          />
          <BoolProperty
            elementId={semanticElement.__id}
            propertyId="isQuery"
            value={!!semanticElement.isQuery}
            label="isQuery"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="visibility"
            choices={PropertyPaletteChoices.VISIBILITY}
            choice={semanticElement.visibility!}
            label="Visibility"
          />
          <ChoiceProperty
            elementId={semanticElement.__id}
            propertyId="concurrency"
            choices={PropertyPaletteChoices.CONCURRENCY}
            choice={semanticElement.concurrency!}
            label="Concurrency"
          />
          <ReferenceProperty
            elementId={semanticElement.__id}
            propertyId="parameters"
            label="Parameters"
            references={(semanticElement.parameters ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed parameter)',
                name: e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])],
              }))}
            creates={[
              {
                label: 'Create Parameter',
                action: CreateNodeOperation.create(ModelTypes.PARAMETER, {
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
