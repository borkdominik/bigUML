// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
  ClassDiagramEdgeTypes,
  ClassDiagramNodeTypes,
} from '../../../common/model-types/class-diagram-model-types.js';
import {
  type Args,
  type MaybePromise,
  type PaletteItem,
  ToolPaletteItemProvider,
  TriggerEdgeCreationAction,
  TriggerNodeCreationAction,
} from '@eclipse-glsp/server';

export class ClassDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
  override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
    return [
      {
        id: 'uml.container',
        sortString: 'A',
        label: 'Container',
        icon: 'symbol-property',
        children: [
          {
            id: 'enumeration',
            sortString: 'A',
            label: 'Enumeration',
            icon: 'uml-enumeration-icon',
            actions: [
              TriggerNodeCreationAction.create(
                ClassDiagramNodeTypes.ENUMERATION,
              ),
            ],
          },
          {
            id: 'class',
            sortString: 'A',
            label: 'Class',
            icon: 'uml-class-icon',
            actions: [
              TriggerNodeCreationAction.create(ClassDiagramNodeTypes.CLASS),
            ],
          },
          {
            id: 'abstract-class',
            sortString: 'A',
            label: 'Abstract Class',
            icon: 'uml-class-icon',
            actions: [
              TriggerNodeCreationAction.create(
                ClassDiagramNodeTypes.ABSTRACT_CLASS,
              ),
            ],
          },
          {
            id: 'interface',
            sortString: 'A',
            label: 'Interface',
            icon: 'uml-interface-icon',
            actions: [
              TriggerNodeCreationAction.create(ClassDiagramNodeTypes.INTERFACE),
            ],
          },
          {
            id: 'data-type',
            sortString: 'A',
            label: 'DataType',
            icon: 'uml-data-type-icon',
            actions: [
              TriggerNodeCreationAction.create(ClassDiagramNodeTypes.DATA_TYPE),
            ],
          },
          {
            id: 'primitive-type',
            sortString: 'A',
            label: 'Primitive Type',
            icon: 'uml-primitive-type-icon',
            actions: [
              TriggerNodeCreationAction.create(
                ClassDiagramNodeTypes.PRIMITIVE_TYPE,
              ),
            ],
          },
          {
            id: 'instance-specification',
            sortString: 'A',
            label: 'Instance Specification',
            icon: 'uml-instance-specification-icon',
            actions: [
              TriggerNodeCreationAction.create(
                ClassDiagramNodeTypes.INSTANCE_SPECIFICATION,
              ),
            ],
          },
          {
            id: 'package',
            sortString: 'A',
            label: 'Package',
            icon: 'uml-package-icon',
            actions: [
              TriggerNodeCreationAction.create(ClassDiagramNodeTypes.PACKAGE),
            ],
          },
        ],
        actions: [],
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
            actions: [
              TriggerNodeCreationAction.create(
                ClassDiagramNodeTypes.ENUMERATION_LITERAL,
              ),
            ],
          },
          {
            id: 'property',
            sortString: 'A',
            label: 'Property',
            icon: 'uml-property-icon',
            actions: [
              TriggerNodeCreationAction.create(ClassDiagramNodeTypes.PROPERTY),
            ],
          },
          {
            id: 'operation',
            sortString: 'A',
            label: 'Operation',
            icon: 'uml-operation-icon',
            actions: [
              TriggerNodeCreationAction.create(ClassDiagramNodeTypes.OPERATION),
            ],
          },
          {
            id: 'slot',
            sortString: 'A',
            label: 'Slot',
            icon: 'uml-slot-icon',
            actions: [
              TriggerNodeCreationAction.create(ClassDiagramNodeTypes.SLOT),
            ],
          },
        ],
        actions: [],
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
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.ABSTRACTION,
              ),
            ],
          },
          {
            id: 'dependency',
            sortString: 'A',
            label: 'Dependency',
            icon: 'uml-dependency-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.DEPENDENCY,
              ),
            ],
          },
          {
            id: 'association',
            sortString: 'A',
            label: 'Association',
            icon: 'uml-association-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.ASSOCIATION,
              ),
            ],
          },
          {
            id: 'aggregation',
            sortString: 'A',
            label: 'Aggregation',
            icon: 'uml-association-shared-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.AGGREGATION,
              ),
            ],
          },
          {
            id: 'composition',
            sortString: 'A',
            label: 'Composition',
            icon: 'uml-association-composite-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.COMPOSITION,
              ),
            ],
          },
          {
            id: 'interface-realization',
            sortString: 'A',
            label: 'Interface Realization',
            icon: 'uml-interface-realization-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.INTERFACE_REALIZATION,
              ),
            ],
          },
          {
            id: 'generalization',
            sortString: 'A',
            label: 'Generalization',
            icon: 'uml-generalization-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.GENERALIZATION,
              ),
            ],
          },
          {
            id: 'package-import',
            sortString: 'A',
            label: 'Package Import',
            icon: 'uml-package-import-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.PACKAGE_IMPORT,
              ),
            ],
          },
          {
            id: 'package-merge',
            sortString: 'A',
            label: 'Package Merge',
            icon: 'uml-package-merge-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.PACKAGE_MERGE,
              ),
            ],
          },
          {
            id: 'realization',
            sortString: 'A',
            label: 'Realization',
            icon: 'uml-realization-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.REALIZATION,
              ),
            ],
          },
          {
            id: 'substitution',
            sortString: 'A',
            label: 'Substitution',
            icon: 'uml-substitution-icon',
            actions: [
              TriggerEdgeCreationAction.create(
                ClassDiagramEdgeTypes.SUBSTITUTION,
              ),
            ],
          },
          {
            id: 'usage',
            sortString: 'A',
            label: 'Usage',
            icon: 'uml-usage-icon',
            actions: [
              TriggerEdgeCreationAction.create(ClassDiagramEdgeTypes.USAGE),
            ],
          },
        ],
        actions: [],
      },
    ];
  }
}
