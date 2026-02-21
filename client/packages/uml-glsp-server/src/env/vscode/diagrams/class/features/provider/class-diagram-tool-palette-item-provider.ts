/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ClassDiagramEdgeTypes, ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import {
    type Args,
    type MaybePromise,
    type PaletteItem,
    ToolPaletteItemProvider,
    TriggerEdgeCreationAction,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';

// TODO: use metadata
export class ClassDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
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
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.CLASS)]
                    },
                    {
                        id: 'abstract_class',
                        sortString: 'A',
                        label: 'Abstract Class',
                        icon: 'uml-class-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.ABSTRACT_CLASS)]
                    },
                    {
                        id: 'data_type',
                        sortString: 'A',
                        label: 'DataType',
                        icon: 'uml-data-type-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.DATA_TYPE)]
                    },
                    {
                        id: 'enumeration',
                        sortString: 'A',
                        label: 'Enumeration',
                        icon: 'uml-enumeration-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.ENUMERATION)]
                    },
                    {
                        id: 'instance-specification',
                        sortString: 'A',
                        label: 'Instance Specification',
                        icon: 'uml-instance-specification-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.INSTANCE_SPECIFICATION)]
                    },
                    {
                        id: 'interface',
                        sortString: 'A',
                        label: 'Interface',
                        icon: 'uml-interface-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.INTERFACE)]
                    },
                    {
                        id: 'package',
                        sortString: 'A',
                        label: 'Package',
                        icon: 'uml-package-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.PACKAGE)]
                    },
                    {
                        id: 'primitive-type',
                        sortString: 'A',
                        label: 'Primitive Type',
                        icon: 'uml-primitive-type-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.PRIMITIVE_TYPE)]
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
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.ENUMERATION_LITERAL)]
                    },
                    {
                        id: 'property',
                        sortString: 'A',
                        label: 'Property',
                        icon: 'uml-property-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.PROPERTY)]
                    },
                    {
                        id: 'operation',
                        sortString: 'A',
                        label: 'Operation',
                        icon: 'uml-operation-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.OPERATION)]
                    },
                    {
                        id: 'slot',
                        sortString: 'A',
                        label: 'Slot',
                        icon: 'uml-slot-icon',
                        actions: [TriggerNodeCreationAction.create(ClassDiagramNodeTypes.SLOT)]
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
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.ABSTRACTION)]
                    },
                    {
                        id: 'aggregation',
                        sortString: 'A',
                        label: 'Aggregation',
                        icon: 'uml-association-shared-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.AGGREGATION)]
                    },
                    {
                        id: 'association',
                        sortString: 'A',
                        label: 'Association',
                        icon: 'uml-association-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.ASSOCIATION)]
                    },
                    {
                        id: 'composition',
                        sortString: 'A',
                        label: 'Composition',
                        icon: 'uml-association-composite-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.COMPOSITION)]
                    },
                    {
                        id: 'dependency',
                        sortString: 'A',
                        label: 'Dependency',
                        icon: 'uml-dependency-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.DEPENDENCY)]
                    },
                    {
                        id: 'generalization',
                        sortString: 'A',
                        label: 'Generalization',
                        icon: 'uml-generalization-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.GENERALIZATION)]
                    },
                    {
                        id: 'interface-realization',
                        sortString: 'A',
                        label: 'Interface Realization',
                        icon: 'uml-interface-realization-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.INTERFACE_REALIZATION)]
                    },
                    {
                        id: 'package-import',
                        sortString: 'A',
                        label: 'Package Import',
                        icon: 'uml-package-import-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.PACKAGE_IMPORT)]
                    },
                    {
                        id: 'package-merge',
                        sortString: 'A',
                        label: 'Package Merge',
                        icon: 'uml-package-merge-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.PACKAGE_MERGE)]
                    },
                    {
                        id: 'realization',
                        sortString: 'A',
                        label: 'Realization',
                        icon: 'uml-realization-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.REALIZATION)]
                    },
                    {
                        id: 'substitution',
                        sortString: 'A',
                        label: 'Substitution',
                        icon: 'uml-substitution-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.SUBSTITUTION)]
                    },
                    {
                        id: 'usage',
                        sortString: 'A',
                        label: 'Usage',
                        icon: 'uml-usage-icon',
                        actions: [TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.USAGE)]
                    }
                ],
                actions: []
            }
        ];
    }
}
