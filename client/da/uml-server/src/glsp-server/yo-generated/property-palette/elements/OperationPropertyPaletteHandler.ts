// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { Operation } from '../../../../language-server/generated/ast.js';
import { ModelTypes } from '../../../util/model-types.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace OperationPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Operation): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                PropertyPalette.builder()
                    .elementId(semanticElement.__id)
                    .label((semanticElement as any).name ?? semanticElement.$type)
                    .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
                    .bool(semanticElement.__id, 'isAbstract', !!semanticElement.isAbstract, 'isAbstract')
                    .bool(semanticElement.__id, 'isStatic', !!semanticElement.isStatic, 'isStatic')
                    .bool(semanticElement.__id, 'isQuery', !!semanticElement.isQuery, 'isQuery')
                    .choice(
                        semanticElement.__id,
                        'visibility',
                        PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
                        semanticElement.visibility,
                        'Visibility'
                    )
                    .choice(
                        semanticElement.__id,
                        'concurrency',
                        PropertyPalette.DEFAULT_CONCURRENCY_CHOICES,
                        semanticElement.concurrency,
                        'Concurrency'
                    )
                    .reference(
                        semanticElement.__id,
                        'parameters',
                        'Parameters',
                        (semanticElement.parameters ?? [])
                            .filter((e: any) => !!e && !!e.__id)
                            .map((e: any) => ({
                                elementId: e.__id,
                                label: e.name ?? '(unnamed parameter)',
                                name: e.name ?? '',
                                deleteActions: [DeleteElementOperation.create([e.__id])]
                            })),
                        [
                            {
                                label: 'Create Parameter',
                                action: CreateNodeOperation.create(ModelTypes.PARAMETER, {
                                    containerId: semanticElement.__id
                                })
                            }
                        ]
                    )
                    .build()
            )
        ];
    }
}
