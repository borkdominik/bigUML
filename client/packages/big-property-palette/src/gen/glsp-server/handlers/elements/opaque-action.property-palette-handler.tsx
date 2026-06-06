// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { type OpaqueAction } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace OpaqueActionPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<OpaqueAction>): SetPropertyPaletteAction[] {
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
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={context.semanticElement.visibility!}
                        label='Visibility'
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='inputPins'
                        label='Input Pins'
                        references={(context.semanticElement.inputPins ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed input_pin)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Input Pin',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('InputPin'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='outputPins'
                        label='Output Pins'
                        references={(context.semanticElement.outputPins ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed output_pin)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Output Pin',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('OutputPin'), {
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
