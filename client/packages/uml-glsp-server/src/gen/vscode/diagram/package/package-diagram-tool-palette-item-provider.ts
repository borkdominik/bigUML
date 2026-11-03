// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { RelationType } from '../../../../env/common/model/relation-type.action.js';
import { PackageDiagramEdgeTypes, PackageDiagramNodeTypes } from '../../../common/model-types/package-diagram-model-types.js';
import { type Args, type MaybePromise, type PaletteItem, ToolPaletteItemProvider, TriggerNodeCreationAction } from '@eclipse-glsp/server';

/**
 * The relations of the diagram. They are not listed in the palette: the "Create relation" tool offers
 * the ones whose ends admit the two elements picked.
 */
export const PackageDiagramRelationTypes: readonly RelationType[] = [
    {
        elementTypeId: PackageDiagramEdgeTypes.ABSTRACTION,
        label: 'Abstraction',
        icon: 'uml-abstraction-icon'
    },
    {
        elementTypeId: PackageDiagramEdgeTypes.DEPENDENCY,
        label: 'Dependency',
        icon: 'uml-dependency-icon'
    },
    {
        elementTypeId: PackageDiagramEdgeTypes.ELEMENT_IMPORT,
        label: 'Element Import',
        icon: 'uml-package-import-icon'
    },
    {
        elementTypeId: PackageDiagramEdgeTypes.GENERIC_EDGE,
        label: 'Generic Edge',
        icon: 'uml-connector-icon'
    },
    {
        elementTypeId: PackageDiagramEdgeTypes.PACKAGE_IMPORT,
        label: 'Package Import',
        icon: 'uml-package-import-icon'
    },
    {
        elementTypeId: PackageDiagramEdgeTypes.PACKAGE_MERGE,
        label: 'Package Merge',
        icon: 'uml-package-merge-icon'
    },
    {
        elementTypeId: PackageDiagramEdgeTypes.USAGE,
        label: 'Usage',
        icon: 'uml-usage-icon'
    }
];

export class PackageDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
        return [
            {
                id: 'uml.annotation',
                sortString: 'A',
                label: 'Annotation',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'text-label',
                        sortString: 'A',
                        label: 'Label',
                        icon: 'uml-string-expression-icon',
                        actions: [TriggerNodeCreationAction.create(PackageDiagramNodeTypes.TEXT_LABEL)]
                    },
                    {
                        id: 'note',
                        sortString: 'A',
                        label: 'Note',
                        icon: 'uml-comment-icon',
                        actions: [TriggerNodeCreationAction.create(PackageDiagramNodeTypes.NOTE)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.feature',
                sortString: 'A',
                label: 'Feature',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'property',
                        sortString: 'A',
                        label: 'Property',
                        icon: 'uml-property-icon',
                        actions: [TriggerNodeCreationAction.create(PackageDiagramNodeTypes.PROPERTY)]
                    },
                    {
                        id: 'operation',
                        sortString: 'A',
                        label: 'Operation',
                        icon: 'uml-operation-icon',
                        actions: [TriggerNodeCreationAction.create(PackageDiagramNodeTypes.OPERATION)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.container',
                sortString: 'A',
                label: 'Container',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'class',
                        sortString: 'A',
                        label: 'Class',
                        icon: 'uml-class-icon',
                        actions: [TriggerNodeCreationAction.create(PackageDiagramNodeTypes.CLASS)]
                    },
                    {
                        id: 'package',
                        sortString: 'A',
                        label: 'Package',
                        icon: 'uml-package-icon',
                        actions: [TriggerNodeCreationAction.create(PackageDiagramNodeTypes.PACKAGE)]
                    }
                ],
                actions: []
            }
        ];
    }
}
