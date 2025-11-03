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

export class ClassDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
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
                        id: 'abstract_class',
                        sortString: 'A',
                        label: 'Abstract Class',
                        icon: 'uml-class-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.ABSTRACT_CLASS)]
                    },
                    {
                        id: 'data_type',
                        sortString: 'A',
                        label: 'DataType',
                        icon: 'uml-data-type-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.DATA_TYPE)]
                    },
                    {
                        id: 'enumeration',
                        sortString: 'A',
                        label: 'Enumeration',
                        icon: 'uml-enumeration-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.ENUMERATION)]
                    },
                    {
                        id: 'instance-specification',
                        sortString: 'A',
                        label: 'Instance Specification',
                        icon: 'uml-instance-specification-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.INSTANCE_SPECIFICATION)]
                    },
                    {
                        id: 'interface',
                        sortString: 'A',
                        label: 'Interface',
                        icon: 'uml-interface-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.INTERFACE)]
                    },
                    {
                        id: 'package',
                        sortString: 'A',
                        label: 'Package',
                        icon: 'uml-package-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.PACKAGE)]
                    },
                    {
                        id: 'primitive-type',
                        sortString: 'A',
                        label: 'Primitive Type',
                        icon: 'uml-primitive-type-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.PRIMITIVE_TYPE)]
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
                        id: 'enumeration-literal',
                        sortString: 'A',
                        label: 'Enumeration Literal',
                        icon: 'uml-enumeration-literal-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.ENUMERATION_LITERAL)]
                    },
                    {
                        id: 'property',
                        sortString: 'A',
                        label: 'Property',
                        icon: 'uml-property-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.PROPERTY)]
                    },
                    {
                        id: 'operation',
                        sortString: 'A',
                        label: 'Operation',
                        icon: 'uml-operation-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.OPERATION)]
                    },
                    {
                        id: 'slot',
                        sortString: 'A',
                        label: 'Slot',
                        icon: 'uml-slot-icon',
                        actions: [TriggerNodeCreationAction.create(ModelTypes.SLOT)]
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
                        id: 'aggregation',
                        sortString: 'A',
                        label: 'Aggregation',
                        icon: 'uml-association-shared-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.AGGREGATION)]
                    },
                    {
                        id: 'association',
                        sortString: 'A',
                        label: 'Association',
                        icon: 'uml-association-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.ASSOCIATION)]
                    },
                    {
                        id: 'composition',
                        sortString: 'A',
                        label: 'Composition',
                        icon: 'uml-association-composite-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.COMPOSITION)]
                    },
                    {
                        id: 'dependency',
                        sortString: 'A',
                        label: 'Dependency',
                        icon: 'uml-dependency-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.DEPENDENCY)]
                    },
                    {
                        id: 'generalization',
                        sortString: 'A',
                        label: 'Generalization',
                        icon: 'uml-generalization-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.GENERALIZATION)]
                    },
                    {
                        id: 'interface-realization',
                        sortString: 'A',
                        label: 'Interface Realization',
                        icon: 'uml-interface-realization-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.INTERFACE_REALIZATION)]
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
                        id: 'realization',
                        sortString: 'A',
                        label: 'Realization',
                        icon: 'uml-realization-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.REALIZATION)]
                    },
                    {
                        id: 'substitution',
                        sortString: 'A',
                        label: 'Substitution',
                        icon: 'uml-substitution-icon',
                        actions: [TriggerEdgeCreationAction.create(ModelTypes.SUBSTITUTION)]
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
