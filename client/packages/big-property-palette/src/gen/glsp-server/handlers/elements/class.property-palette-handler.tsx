// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { type Class } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    BoolProperty,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace ClassPropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Class>): SetPropertyPaletteAction[] {
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
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='properties'
                        label='Properties'
                        references={(context.semanticElement.properties ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed property)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Property',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('Property'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <ReferenceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='operations'
                        label='Operations'
                        references={(context.semanticElement.operations ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed operation)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Operation',
                                action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('Operation'), {
                                    containerId: context.semanticElement.__id
                                })
                            }
                        ]}
                    />
                    <BoolProperty
                        elementId={context.semanticElement.__id}
                        propertyId='isActive'
                        value={!!context.semanticElement.isActive}
                        label='isActive'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={context.semanticElement.visibility!}
                        label='Visibility'
                    />
                </PropertyPalette>
            )
        ];
    }
}
