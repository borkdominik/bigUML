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
    DeploymentDiagramNodeTypes,
    InformationFlowDiagramNodeTypes,
    PackageDiagramNodeTypes,
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
        mapping.set(CommonModelTypes.COMP_STATE_REGION, GCompartment);
        mapping.set(CommonModelTypes.COMP_STATE_PARTS, GCompartment);
        mapping.set(CommonModelTypes.LABEL_ICON, GLabel);
        mapping.set(CommonModelTypes.ICON, GCompartment);
        mapping.set(ClassDiagramNodeTypes.CLASS, GClassNode);
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
                    ClassDiagramNodeTypes.CLASS,
                    ClassDiagramNodeTypes.DATA_TYPE,
                    ClassDiagramNodeTypes.ENUMERATION,
                    ClassDiagramNodeTypes.INTERFACE,
                    ClassDiagramNodeTypes.PACKAGE,
                    ClassDiagramNodeTypes.PRIMITIVE_TYPE
                ]
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
                    StateMachineDiagramNodeTypes.ENTRY_POINT,
                    StateMachineDiagramNodeTypes.EXIT_POINT,
                    StateMachineDiagramNodeTypes.FINAL_STATE,
                    StateMachineDiagramNodeTypes.FORK,
                    StateMachineDiagramNodeTypes.INITIAL_STATE,
                    StateMachineDiagramNodeTypes.JOIN,
                    StateMachineDiagramNodeTypes.REGION,
                    StateMachineDiagramNodeTypes.SHALLOW_HISTORY,
                    StateMachineDiagramNodeTypes.STATE,
                    StateMachineDiagramNodeTypes.TERMINATE
                ]
            },
            // A region standing on its own - the area a state machine's states are drawn on. Resizable,
            // which it is not without a hint of its own: `TypeHintProvider` grants `resizeFeature` from
            // `resizable` and from nothing else, so a region had no handles to be dragged out with at
            // all. What may be dropped on it is what may stand in a region, which is every vertex of a
            // state machine but not another region - a region divides a state, not another region.
            {
                elementTypeId: StateMachineDiagramNodeTypes.REGION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [
                    StateMachineDiagramNodeTypes.CHOICE,
                    StateMachineDiagramNodeTypes.DEEP_HISTORY,
                    StateMachineDiagramNodeTypes.ENTRY_POINT,
                    StateMachineDiagramNodeTypes.EXIT_POINT,
                    StateMachineDiagramNodeTypes.FINAL_STATE,
                    StateMachineDiagramNodeTypes.FORK,
                    StateMachineDiagramNodeTypes.INITIAL_STATE,
                    StateMachineDiagramNodeTypes.JOIN,
                    StateMachineDiagramNodeTypes.SHALLOW_HISTORY,
                    StateMachineDiagramNodeTypes.STATE,
                    StateMachineDiagramNodeTypes.TERMINATE
                ]
            },
            // A state holding regions is the frame its substates are drawn on, so everything that can
            // stand inside one has to be named here or the client refuses the drop - they are added as
            // flat siblings drawn on top, see `FLAT_CONTAINER_TYPES`.
            {
                elementTypeId: StateMachineDiagramNodeTypes.STATE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [
                    StateMachineDiagramNodeTypes.CHOICE,
                    StateMachineDiagramNodeTypes.DEEP_HISTORY,
                    StateMachineDiagramNodeTypes.ENTRY_POINT,
                    StateMachineDiagramNodeTypes.EXIT_POINT,
                    StateMachineDiagramNodeTypes.FINAL_STATE,
                    StateMachineDiagramNodeTypes.FORK,
                    StateMachineDiagramNodeTypes.INITIAL_STATE,
                    StateMachineDiagramNodeTypes.JOIN,
                    StateMachineDiagramNodeTypes.SHALLOW_HISTORY,
                    StateMachineDiagramNodeTypes.STATE,
                    StateMachineDiagramNodeTypes.TERMINATE
                ]
            },
            // The band a region is drawn as. Resizable and nothing else: it is how tall the region is
            // that the user drags, and a hint is the only thing that grants the handles to do it with -
            // `TypeHintProvider` takes `resizeFeature` from `resizable` and from nowhere else. Not
            // repositionable, because the band is placed by the state that owns it and a move would
            // spring back on the next redraw; deletable, because deleting the band is deleting the
            // region. What may be dropped on it is what may be dropped on the state.
            {
                elementTypeId: CommonModelTypes.COMP_STATE_REGION,
                repositionable: false,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [
                    StateMachineDiagramNodeTypes.CHOICE,
                    StateMachineDiagramNodeTypes.DEEP_HISTORY,
                    StateMachineDiagramNodeTypes.ENTRY_POINT,
                    StateMachineDiagramNodeTypes.EXIT_POINT,
                    StateMachineDiagramNodeTypes.FINAL_STATE,
                    StateMachineDiagramNodeTypes.FORK,
                    StateMachineDiagramNodeTypes.INITIAL_STATE,
                    StateMachineDiagramNodeTypes.JOIN,
                    StateMachineDiagramNodeTypes.SHALLOW_HISTORY,
                    StateMachineDiagramNodeTypes.STATE,
                    StateMachineDiagramNodeTypes.TERMINATE
                ]
            },
            // The compartment a state's parts are written in. Adjusted through `State.partsHeight` in the
            // property panel rather than by dragging: a resize is recorded against the element it was
            // performed on, and this compartment is not an element - a `Size` naming it would go out as a
            // reference to nothing and leave the file unparseable. So it takes no handles, and nothing
            // may be dropped on it either.
            {
                elementTypeId: CommonModelTypes.COMP_STATE_PARTS,
                repositionable: false,
                deletable: false,
                resizable: false,
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
                // The same diamond on the class diagram. A node type is scoped to one diagram, so the
                // state machine's hint above says nothing about this one - and without a hint of its own
                // it would be drawn at whatever size it was created with and never resizable.
                ClassDiagramNodeTypes.CHOICE,
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
            // The note and the free label, in every diagram there is - both say something about the
            // diagram rather than being part of any one notation, so they are drawn in all of them and
            // need a hint in all of them. A node type is scoped to one diagram, so there is no single
            // hint that could cover either. Resizable above all: how wide one is drawn is where its text
            // wraps, so dragging it out is how the writing in it is laid out, and a hint is the only
            // thing that grants the handles to do it with (`TypeHintProvider` takes `resizeFeature` from
            // `resizable` and from nowhere else). Nothing is containable - both hold writing, not shapes.
            ...[
                ActivityDiagramNodeTypes.NOTE,
                ClassDiagramNodeTypes.NOTE,
                CommunicationDiagramNodeTypes.NOTE,
                DeploymentDiagramNodeTypes.NOTE,
                InformationFlowDiagramNodeTypes.NOTE,
                PackageDiagramNodeTypes.NOTE,
                StateMachineDiagramNodeTypes.NOTE,
                UseCaseDiagramNodeTypes.NOTE,
                ActivityDiagramNodeTypes.TEXT_LABEL,
                ClassDiagramNodeTypes.TEXT_LABEL,
                CommunicationDiagramNodeTypes.TEXT_LABEL,
                DeploymentDiagramNodeTypes.TEXT_LABEL,
                InformationFlowDiagramNodeTypes.TEXT_LABEL,
                PackageDiagramNodeTypes.TEXT_LABEL,
                StateMachineDiagramNodeTypes.TEXT_LABEL,
                UseCaseDiagramNodeTypes.TEXT_LABEL
            ].map(elementTypeId => ({
                elementTypeId,
                repositionable: true,
                deletable: true,
                resizable: true,
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
        sourceElementTypeIds: [ClassDiagramNodeTypes.CLASS, ClassDiagramNodeTypes.INTERFACE],
        targetElementTypeIds: [ClassDiagramNodeTypes.CLASS, ClassDiagramNodeTypes.INTERFACE]
    };
}
