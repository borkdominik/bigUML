// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { type Operation } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    BoolProperty,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace OperationPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Operation>): SetPropertyPaletteAction[] {
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
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isAbstract'
                        value={!!context.semanticElement.isAbstract}
                        label='isAbstract'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isStatic'
                        value={!!context.semanticElement.isStatic}
                        label='isStatic'
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isQuery'
                        value={!!context.semanticElement.isQuery}
                        label='isQuery'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={context.semanticElement.visibility!}
                        label='Visibility'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='concurrency'
                        choices={PropertyPaletteChoices.CONCURRENCY}
                        choice={context.semanticElement.concurrency!}
                        label='Concurrency'
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='parameters'
                        label='Parameters'
                        references={(context.semanticElement.parameters ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed parameter)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Parameter',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('Parameter'), {
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
