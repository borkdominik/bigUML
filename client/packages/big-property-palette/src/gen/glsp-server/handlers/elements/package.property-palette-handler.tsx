// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { DeleteElementOperation } from '@eclipse-glsp/server';
import { type Package } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    ReferenceProperty,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace PackagePropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<Package>): SetPropertyPaletteAction[] {
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
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='uri'
                        text={context.semanticElement.uri!}
                        label='Uri'
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
                        propertyId='entities'
                        label='Entities'
                        references={(context.semanticElement.entities ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed node)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            }))}
                        creates={[]}
                    />
                </PropertyPalette>
            )
        ];
    }
}
