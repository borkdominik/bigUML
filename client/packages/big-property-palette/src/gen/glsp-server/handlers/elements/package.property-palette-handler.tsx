// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { type Package } from '@borkdominik-biguml/uml-model-server/grammar';
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import {
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace PackagePropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Package): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                <PropertyPalette elementId={semanticElement.__id} label={(semanticElement as any).name ?? semanticElement.$type}>
                    <TextProperty elementId={semanticElement.__id} propertyId='name' text={semanticElement.name!} label='Name' />
                    <TextProperty elementId={semanticElement.__id} propertyId='uri' text={semanticElement.uri!} label='Uri' />
                    <ChoiceProperty
                        elementId={semanticElement.__id}
                        propertyId='visibility'
                        choices={PropertyPaletteChoices.VISIBILITY}
                        choice={semanticElement.visibility!}
                        label='Visibility'
                    />
                    <ReferenceProperty
                        elementId={semanticElement.__id}
                        propertyId='entities'
                        label='Entities'
                        references={(semanticElement.entities ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed node)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[
                            {
                                label: 'Create Node',
                                action: CreateNodeOperation.create(ClassDiagramNodeTypes.NODE, { containerId: semanticElement.__id })
                            }
                        ]}
                    />
                </PropertyPalette>
            )
        ];
    }
}
