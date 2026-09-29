// AUTO-GENERATED – DO NOT EDIT
/** @jsxImportSource @borkdominik-biguml/big-property-palette/jsx */

import { SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type GenericEdge } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type GetPropertyPaletteHandlerContext,
    ChoiceProperty,
    PropertyPalette,
    PropertyPaletteChoices,
    TextProperty
} from '@borkdominik-biguml/big-property-palette/glsp-server';

export namespace GenericEdgePropertyPaletteHandler {
    export function getPropertyPalette(context: GetPropertyPaletteHandlerContext<GenericEdge>): SetPropertyPaletteAction[] {
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
                        propertyId='sourceMarker'
                        choices={PropertyPaletteChoices.EDGE_MARKER}
                        choice={context.semanticElement.sourceMarker!}
                        label='Source Marker'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='targetMarker'
                        choices={PropertyPaletteChoices.EDGE_MARKER}
                        choice={context.semanticElement.targetMarker!}
                        label='Target Marker'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='lineStyle'
                        choices={PropertyPaletteChoices.EDGE_LINE_STYLE}
                        choice={context.semanticElement.lineStyle!}
                        label='Edge Line Style'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='sourceMultiplicity'
                        text={context.semanticElement.sourceMultiplicity!}
                        label='Source Multiplicity'
                    />
                    <TextProperty
                        elementId={context.semanticElement.__id}
                        propertyId='targetMultiplicity'
                        text={context.semanticElement.targetMultiplicity!}
                        label='Target Multiplicity'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='sourcePoint'
                        choices={PropertyPaletteChoices.CONNECTION_POINT}
                        choice={context.semanticElement.sourcePoint!}
                        label='Source Point'
                    />
                    <ChoiceProperty
                        elementId={context.semanticElement.__id}
                        propertyId='targetPoint'
                        choices={PropertyPaletteChoices.CONNECTION_POINT}
                        choice={context.semanticElement.targetPoint!}
                        label='Target Point'
                    />
                </PropertyPalette>
            )
        ];
    }
}
