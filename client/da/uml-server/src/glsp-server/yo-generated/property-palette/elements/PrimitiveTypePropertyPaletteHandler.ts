// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';
import { PrimitiveType } from '../../../../language-server/generated/ast.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace PrimitiveTypePropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: PrimitiveType): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                PropertyPalette.builder()
                    .elementId(semanticElement.__id)
                    .label((semanticElement as any).name ?? semanticElement.$type)
                    .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
                    .build()
            )
        ];
    }
}
