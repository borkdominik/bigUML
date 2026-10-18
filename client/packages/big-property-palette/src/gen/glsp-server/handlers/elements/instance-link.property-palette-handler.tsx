// AUTO-GENERATED – DO NOT EDIT
/** @jsxImportSource @borkdominik-biguml/big-property-palette/jsx */

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type InstanceLink } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace InstanceLinkPropertyPaletteHandler {
    export function getPropertyPalette(
        context: GetPropertyPaletteHandlerContext<InstanceLink>,
        associationChoices: any
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
                        propertyId='association'
                        choices={associationChoices}
                        choice={
                            (context.semanticElement.association as any)?.ref?.__id
                                ? (context.semanticElement.association as any).ref.__id + '_refValue'
                                : ''
                        }
                        label='Association'
                    />
                </PropertyPalette>
            )
        ];
    }
}
