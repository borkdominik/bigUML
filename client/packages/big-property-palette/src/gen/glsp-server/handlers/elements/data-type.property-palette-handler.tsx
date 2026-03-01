// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import {
    BoolProperty,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { type DataType } from '@borkdominik-biguml/uml-model-server/grammar';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';

export namespace DataTypePropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: DataType): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <TextProperty elementId={semanticElement.__id} propertyId='name' text={semanticElement.name!} label='Name' />
                    <ReferenceProperty
                        elementId={semanticElement.__id}
                        propertyId='properties'
                        label='Properties'
                        references={(semanticElement.properties ?? [])
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
                                action: CreateNodeOperation.create(ClassDiagramNodeTypes.PROPERTY, { containerId: semanticElement.__id })
                            }
                        ]}
                    />
                    <ReferenceProperty
                        elementId={semanticElement.__id}
                        propertyId='operations'
                        label='Operations'
                        references={(semanticElement.operations ?? [])
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
                                action: CreateNodeOperation.create(ClassDiagramNodeTypes.OPERATION, { containerId: semanticElement.__id })
                            }
                        ]}
                    />
                    <BoolProperty
                        elementId={semanticElement.__id}
                        propertyId='isAbstract'
                        value={!!semanticElement.isAbstract}
                        label='isAbstract'
                    />
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={semanticElement.visibility!}
                        label='Visibility'
                    />
                </PropertyPalette>
            )
        ];
    }
}
