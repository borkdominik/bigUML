// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';
import { Property } from '../../../../language-server/generated/ast.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace PropertyPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Property, dataTypeChoices): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                PropertyPalette.builder()
                    .elementId(semanticElement.__id)
                    .label((semanticElement as any).name ?? semanticElement.$type)
                    .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
                    .bool(semanticElement.__id, 'isDerived', !!semanticElement.isDerived, 'isDerived')
                    .bool(semanticElement.__id, 'isOrdered', !!semanticElement.isOrdered, 'isOrdered')
                    .bool(semanticElement.__id, 'isStatic', !!semanticElement.isStatic, 'isStatic')
                    .bool(semanticElement.__id, 'isDerivedUnion', !!semanticElement.isDerivedUnion, 'isDerivedUnion')
                    .bool(semanticElement.__id, 'isReadOnly', !!semanticElement.isReadOnly, 'isReadOnly')
                    .bool(semanticElement.__id, 'isUnique', !!semanticElement.isUnique, 'isUnique')
                    .choice(
                        semanticElement.__id,
                        'visibility',
                        PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
                        semanticElement.visibility,
                        'Visibility'
                    )
                    .text(semanticElement.__id, 'multiplicity', semanticElement.multiplicity, 'Multiplicity')
                    .choice(
                        semanticElement.__id,
                        'propertyType',
                        dataTypeChoices,
                        (semanticElement.propertyType as any)?.ref?.__id
                            ? (semanticElement.propertyType as any).ref.__id + '_refValue'
                            : '',
                        'Property Type'
                    )
                    .choice(
                        semanticElement.__id,
                        'aggregation',
                        PropertyPalette.DEFAULT_AGGREGATION_CHOICES,
                        semanticElement.aggregation,
                        'Aggregation Type'
                    )
                    .build()
            )
        ];
    }
}
