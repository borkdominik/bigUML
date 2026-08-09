/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    ActivityDiagramNodeTypes,
    ClassDiagramNodeTypes,
    CommonModelTypes,
    CommunicationDiagramNodeTypes,
    InformationFlowDiagramNodeTypes,
    StateMachineDiagramNodeTypes,
    UseCaseDiagramNodeTypes
} from '@borkdominik-biguml/uml-glsp-server';
import { DefaultTypes, type EdgeTypeHint, type ShapeTypeHint } from '@eclipse-glsp/protocol';
import {
    type DiagramConfiguration,
    GCompartment,
    GLabel,
    type GModelElementConstructor,
    ServerLayoutKind,
    getDefaultMapping
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { GClassNode } from '../elements/class.element.js';
import { GEnumerationNode } from '../elements/enumeration.element.js';
import { GInterfaceNode } from '../elements/interface.element.js';
import { GOperationNode } from '../elements/operation.element.js';
import { GPackageNode } from '../elements/package.element.js';
import { GPropertyNode } from '../elements/property.element.js';

@injectable()
export class UmlDiagramConfiguration implements DiagramConfiguration {
    get typeMapping(): Map<string, GModelElementConstructor> {
        const mapping = getDefaultMapping();
        mapping.set(CommonModelTypes.LABEL_HEADING, GLabel);
        mapping.set(CommonModelTypes.LABEL_TEXT, GLabel);
        mapping.set(CommonModelTypes.COMP_HEADER, GCompartment);
        mapping.set(CommonModelTypes.LABEL_ICON, GLabel);
        mapping.set(CommonModelTypes.ICON, GCompartment);
        mapping.set(ClassDiagramNodeTypes.CLASS, GClassNode);
        mapping.set(ClassDiagramNodeTypes.ABSTRACT_CLASS, GClassNode);
        mapping.set(ClassDiagramNodeTypes.PROPERTY, GPropertyNode);
        mapping.set(ClassDiagramNodeTypes.OPERATION, GOperationNode);
        mapping.set(ClassDiagramNodeTypes.INTERFACE, GInterfaceNode);
        mapping.set(ClassDiagramNodeTypes.ENUMERATION, GEnumerationNode);
        mapping.set(ClassDiagramNodeTypes.ENUMERATION_LITERAL, GEnumerationNode);
        mapping.set(ClassDiagramNodeTypes.PACKAGE, GPackageNode);
        return mapping;
    }

    get shapeTypeHints(): ShapeTypeHint[] {
        return [
            {
                elementTypeId: ClassDiagramNodeTypes.CLASS,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.PACKAGE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [
                    ClassDiagramNodeTypes.ABSTRACT_CLASS,
                    ClassDiagramNodeTypes.CLASS,
                    ClassDiagramNodeTypes.DATA_TYPE,
                    ClassDiagramNodeTypes.ENUMERATION,
                    ClassDiagramNodeTypes.INTERFACE,
                    ClassDiagramNodeTypes.PACKAGE,
                    ClassDiagramNodeTypes.PRIMITIVE_TYPE
                ]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.ABSTRACT_CLASS,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.INTERFACE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.ENUMERATION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.ENUMERATION_LITERAL]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.INSTANCE_SPECIFICATION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.SLOT]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.PRIMITIVE_TYPE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            // Members of a classifier are laid out by their container, so they are neither
            // repositionable nor resizable — only the owning classifier is.
            {
                elementTypeId: ClassDiagramNodeTypes.SLOT,
                repositionable: false,
                deletable: true,
                resizable: false,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: ClassDiagramNodeTypes.ENUMERATION_LITERAL,
                repositionable: false,
                deletable: true,
                resizable: false,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: ClassDiagramNodeTypes.OPERATION,
                repositionable: false,
                deletable: true,
                resizable: false,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: ClassDiagramNodeTypes.PROPERTY,
                repositionable: false,
                deletable: true,
                resizable: false,
                reparentable: false,
                containableElementTypeIds: []
            },
            // The same property, written as a row on an activity frame - the parameters listed under its
            // name. A node type is scoped to one diagram, so the class hint above does not cover it, and a
            // row left unhinted is not marked as laid out by the frame that draws it: the frame then has a
            // child that reads as independently movable, which is what took the resize handles off the
            // frame itself.
            {
                elementTypeId: ActivityDiagramNodeTypes.PROPERTY,
                repositionable: false,
                deletable: true,
                resizable: false,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: StateMachineDiagramNodeTypes.STATE_MACHINE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                // The frame is drawn around the whole state machine, so every other node of the diagram
                // must remain creatable on top of it (they are added as flat siblings, see
                // `GenericCreateNodeOperationHandler.FLAT_CONTAINER_TYPES`).
                containableElementTypeIds: [
                    StateMachineDiagramNodeTypes.CHOICE,
                    StateMachineDiagramNodeTypes.DEEP_HISTORY,
                    StateMachineDiagramNodeTypes.FINAL_STATE,
                    StateMachineDiagramNodeTypes.FORK,
                    StateMachineDiagramNodeTypes.INITIAL_STATE,
                    StateMachineDiagramNodeTypes.JOIN,
                    StateMachineDiagramNodeTypes.REGION,
                    StateMachineDiagramNodeTypes.SHALLOW_HISTORY,
                    StateMachineDiagramNodeTypes.STATE
                ]
            },
            {
                elementTypeId: StateMachineDiagramNodeTypes.STATE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            // The bars and the branch diamonds. A node only gets resize handles through a hint of its
            // own - `TypeHintProvider` grants `resizeFeature` from `resizable` and from nothing else -
            // so leaving these out is what made them fixed in size while still being movable. A bar in
            // particular needs them: which way it runs is its shape, so standing one up is a resize.
            ...[
                StateMachineDiagramNodeTypes.FORK,
                StateMachineDiagramNodeTypes.JOIN,
                StateMachineDiagramNodeTypes.CHOICE,
                ActivityDiagramNodeTypes.FORK_NODE,
                ActivityDiagramNodeTypes.JOIN_NODE,
                ActivityDiagramNodeTypes.DECISION_NODE,
                ActivityDiagramNodeTypes.MERGE_NODE
            ].map(elementTypeId => ({
                elementTypeId,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            })),
            {
                elementTypeId: CommunicationDiagramNodeTypes.INTERACTION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                // The frame is drawn around the whole communication diagram, so the lifelines must remain
                // creatable on top of it (they are added as flat siblings, see
                // `GenericCreateNodeOperationHandler.FLAT_CONTAINER_TYPES`).
                containableElementTypeIds: [CommunicationDiagramNodeTypes.LIFELINE]
            },
            {
                elementTypeId: UseCaseDiagramNodeTypes.SUBJECT,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: UseCaseDiagramNodeTypes.USE_CASE,
                repositionable: true,
                deletable: true,
                resizable: false,
                reparentable: false,
                containableElementTypeIds: []
            },
            // The activity frame. Resizable, because it is the boundary the flow is drawn inside and has
            // to be dragged out to fit it. Nothing is named as containable: an activity holds its nodes
            // the way a subject and a state machine frame do, by having them drawn on top of it as flat
            // siblings - see `FLAT_CONTAINER_TYPES`, which is what keeps a node dropped on one from being
            // nested into `Activity.nodes`, where the gmodel factory would never reach it to draw it.
            {
                elementTypeId: ActivityDiagramNodeTypes.ACTIVITY,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            // A swimlane, and so resizable for the same reason the frame is: it is the band its actions
            // are drawn along and has to be dragged out to fit them. Nothing is named as containable -
            // the actions sit on it as flat siblings, as they do on the frame.
            {
                elementTypeId: ActivityDiagramNodeTypes.ACTIVITY_PARTITION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            // An action holds its pins. Without a hint naming them the client refuses the drop and lets
            // it fall through to the canvas, which is what made a pin dropped on an action - or on one of
            // the dots marking where a pin goes - land beside it as a node of its own instead. Where it
            // is then stored is already settled: `getCreationPath` puts it in `inputPins`/`outputPins`.
            {
                elementTypeId: ActivityDiagramNodeTypes.OPAQUE_ACTION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ActivityDiagramNodeTypes.INPUT_PIN, ActivityDiagramNodeTypes.OUTPUT_PIN]
            },
            // The parameter node, drawn as a plain box straddling the border of its activity. Resizable
            // because its size is now held rather than shrunk onto its name (see
            // `GActivityParameterNodeNodeElement`), and a parameter named at any length has to be given
            // room for it - without a hint of its own it would have no handles to do that with.
            {
                elementTypeId: ActivityDiagramNodeTypes.ACTIVITY_PARAMETER_NODE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            // The pins of an action. Deletable, and nothing else: a pin is placed on the boundary by the
            // action that owns it and drawn at a fixed size, so a move or a resize has nowhere to be
            // recorded and would spring back on the next redraw. `TypeHintProvider` hands each of these
            // straight to the matching feature, and a hint is the only thing that takes one away.
            ...[ActivityDiagramNodeTypes.INPUT_PIN, ActivityDiagramNodeTypes.OUTPUT_PIN].map(elementTypeId => ({
                elementTypeId,
                repositionable: false,
                deletable: true,
                resizable: false,
                reparentable: false,
                containableElementTypeIds: []
            })),
            // The actor, in either of the diagrams it appears in. Drawn as the stick figure alone, with
            // no box around it, so its size is whatever the figure and the name below it need - there is
            // nothing for a resize handle to take hold of.
            ...[UseCaseDiagramNodeTypes.ACTOR, InformationFlowDiagramNodeTypes.ACTOR].map(elementTypeId => ({
                elementTypeId,
                repositionable: true,
                deletable: true,
                resizable: false,
                reparentable: false,
                containableElementTypeIds: []
            }))
        ];
    }

    get edgeTypeHints(): EdgeTypeHint[] {
        return [createDefaultEdgeTypeHint(DefaultTypes.EDGE)];
    }

    layoutKind = ServerLayoutKind.MANUAL;
    needsClientLayout = true;
    animatedUpdate = true;
}

export function createDefaultShapeTypeHint(elementId: string): ShapeTypeHint {
    return {
        elementTypeId: elementId,
        repositionable: true,
        deletable: true,
        resizable: true,
        reparentable: true
    };
}

export function createDefaultEdgeTypeHint(elementId: string): EdgeTypeHint {
    return {
        elementTypeId: elementId,
        repositionable: true,
        deletable: true,
        routable: true,
        sourceElementTypeIds: [ClassDiagramNodeTypes.CLASS, ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.INTERFACE],
        targetElementTypeIds: [ClassDiagramNodeTypes.CLASS, ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.INTERFACE]
    };
}
