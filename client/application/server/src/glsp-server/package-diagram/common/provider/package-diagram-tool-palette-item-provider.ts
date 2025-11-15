/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Args,
    MaybePromise,
    PaletteItem,
    ToolPaletteItemProvider,
    TriggerEdgeCreationAction,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { ModelTypes } from '../util/model-types.js';

export class PackageDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(args?: Args): MaybePromise<PaletteItem[]> {
        return [
            {
                id: 'uml.classifier',
                sortString: 'A',
                label: 'Container',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'class',
                        sortString: 'A',
                        label: 'Class',
                        icon: 'uml-class-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.CLASS)]
                    },
                    {
                        id: 'package',
                        sortString: 'A',
                        label: 'Package',
                        icon: 'uml-package-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.PACKAGE)]
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
                        id: 'abstraction',
                        sortString: 'A',
                        label: 'Abstraction',
                        icon: 'uml-abstraction-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.ABSTRACTION)]
                    },
                    {
                        id: 'dependency',
                        sortString: 'A',
                        label: 'Dependency',
                        icon: 'uml-dependency-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.DEPENDENCY)]
                    },
                    {
                        id: 'element-import',
                        sortString: 'A',
                        label: 'Element Import',
                        icon: 'uml-element-import-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.ELEMENT_IMPORT)]
                    },
                    {
                        id: 'package-import',
                        sortString: 'A',
                        label: 'Package Import',
                        icon: 'uml-package-import-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.PACKAGE_IMPORT)]
                    },
                    {
                        id: 'package-merge',
                        sortString: 'A',
                        label: 'Package Merge',
                        icon: 'uml-package-merge-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.PACKAGE_MERGE)]
                    },
                    {
                        id: 'usage',
                        sortString: 'A',
                        label: 'Usage',
                        icon: 'uml-usage-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.USAGE)]
                    }
                ],
                actions: []
            }
        ];
    }
}
