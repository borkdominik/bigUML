// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { type Slot } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace SlotPropertyPaletteHandler {
    export function getPropertyPalette(
        context: GetPropertyPaletteHandlerContext<Slot>,
        definingFeatureChoices: any
    ): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette
                    elementId={context.semanticElement.__id}
                    label={(context.semanticElement as any).name ?? context.semanticElement.$type}
                >
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='name'
                        text={context.semanticElement.name!}
                        label='Name'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='definingFeature'
                        choices={definingFeatureChoices}
                        choice={
                            (context.semanticElement.definingFeature as any)?.ref?.__id
                                ? (context.semanticElement.definingFeature as any).ref.__id + '_refValue'
                                : ''
                        }
                        label='Defining Feature'
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='values'
                        label='Values'
                        references={(context.semanticElement.values ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed literal_specification)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Literal Specification',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('LiteralSpecification'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                </PropertyPalette>
            )
        ];
    }
}
