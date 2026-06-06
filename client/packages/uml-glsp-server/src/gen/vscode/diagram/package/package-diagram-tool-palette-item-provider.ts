// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { PackageDiagramEdgeTypes, PackageDiagramNodeTypes } from '../../../common/model-types/package-diagram-model-types.js';
import {
    type Args,
    type MaybePromise,
    type PaletteItem,
    ToolPaletteItemProvider,
    TriggerEdgeCreationAction,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';

export class PackageDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
        return [
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
            },
            {
                id: 'uml.relations',
                sortString: 'A',
                label: 'Relations',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'usage',
                        sortString: 'A',
                        label: 'Usage',
                        icon: 'uml-usage-icon',
                        actions: [TriggerEdgeCreationAction.create(PackageDiagramEdgeTypes.USAGE)]
                    },
                    {
                        id: 'package-merge',
                        sortString: 'A',
                        label: 'Package Merge',
                        icon: 'uml-package-merge-icon',
                        actions: [TriggerEdgeCreationAction.create(PackageDiagramEdgeTypes.PACKAGE_MERGE)]
                    },
                    {
                        id: 'package-import',
                        sortString: 'A',
                        label: 'Package Import',
                        icon: 'uml-package-import-icon',
                        actions: [TriggerEdgeCreationAction.create(PackageDiagramEdgeTypes.PACKAGE_IMPORT)]
                    },
                    {
                        id: 'element-import',
                        sortString: 'A',
                        label: 'Element Import',
                        icon: 'uml-package-import-icon',
                        actions: [TriggerEdgeCreationAction.create(PackageDiagramEdgeTypes.ELEMENT_IMPORT)]
                    },
                    {
                        id: 'dependency',
                        sortString: 'A',
                        label: 'Dependency',
                        icon: 'uml-dependency-icon',
                        actions: [TriggerEdgeCreationAction.create(PackageDiagramEdgeTypes.DEPENDENCY)]
                    },
                    {
                        id: 'abstraction',
                        sortString: 'A',
                        label: 'Abstraction',
                        icon: 'uml-abstraction-icon',
                        actions: [TriggerEdgeCreationAction.create(PackageDiagramEdgeTypes.ABSTRACTION)]
                    }
                ],
                actions: []
            }
        ];
    }
}
