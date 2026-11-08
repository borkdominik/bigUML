/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type RelationType, RequestRelationTypesAction } from '@borkdominik-biguml/uml-glsp-server';
import {
    Action,
    CreateEdgeOperation,
    DefaultTypes,
    Disposable,
    DrawFeedbackEdgeAction,
    EdgeCreationTool,
    EnableDefaultToolsAction,
    EnableToolsAction,
    FeedbackEdgeEndMovingMouseListener,
    type GModelElement,
    hasStringProp,
    type IActionDispatcher,
    isConnectable,
    type ITypeHintProvider,
    KeyListener,
    matchesKeystroke,
    type Point,
    RemoveFeedbackEdgeAction,
    TriggerEdgeCreationAction
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { UmlEdgeCreationToolMouseListener } from '../edge-creation/uml-edge-creation-tool-mouse-listener.js';
import { RelationTypePicker } from './relation-type-picker.js';

/** Starts the {@link RelationCreationTool} with the relation's source already picked - by a shape's arrow. */
export interface StartRelationCreationAction extends Action {
    kind: typeof StartRelationCreationAction.KIND;
    sourceElementId: string;
}

export namespace StartRelationCreationAction {
    export const KIND = 'startRelationCreation';

    export function is(object: unknown): object is StartRelationCreationAction {
        return Action.hasKind(object, KIND) && hasStringProp(object, 'sourceElementId');
    }

    export function create(sourceElementId: string): StartRelationCreationAction {
        return { kind: KIND, sourceElementId };
    }
}

/**
 * Draws a relation without its type being chosen first: the source and the target are picked on the
 * canvas, and the type is chosen from the relations that may run between them.
 *
 * Which relations those are is the server's answer (`RequestRelationTypesAction`), read off the
 * metamodel. An element no relation of the diagram may start at - or, once a source is picked, end at -
 * takes the not-allowed cursor and no click. Where exactly one relation fits, it is created outright;
 * where several do, the {@link RelationTypePicker} opens at the cursor to choose from.
 *
 * Built on the edge creation tool for everything that does not depend on the type: the feedback edge,
 * the cursors, connecting to a connection point or to the centre of another edge. Until a type is
 * chosen the edge is drawn as the generic `edge`, whose type hint admits every end the diagram has.
 */
@injectable()
export class RelationCreationTool extends EdgeCreationTool {
    static override ID = 'tool_create_relation';

    @inject(RelationTypePicker) protected readonly picker: RelationTypePicker;

    protected override triggerAction = TriggerEdgeCreationAction.create(DefaultTypes.EDGE);

    // Enabled from the palette rather than triggered: there is no type to trigger it with.
    protected override isTriggerAction = (_object: unknown): _object is TriggerEdgeCreationAction => false;

    /** The source the next relation starts at, where the tool was started from a shape's arrow. */
    protected startSourceId?: string;

    /** Moves the loose end of the feedback edge with the mouse - except while it is held on the target. */
    protected edgeEndListener?: HoldableFeedbackEdgeEndMovingMouseListener;

    override get id(): string {
        return RelationCreationTool.ID;
    }

    override handle(action: Action): Action | void {
        if (StartRelationCreationAction.is(action)) {
            this.startSourceId = action.sourceElementId;
            return EnableToolsAction.create([this.id]);
        }
    }

    protected override creationListener(): void {
        const listener = new RelationCreationToolMouseListener(
            this.triggerAction,
            this.actionDispatcher,
            this.typeHintProvider,
            this,
            this.picker,
            held => this.edgeEndListener?.hold(held),
            this.grid ? this.grid.x / 2 : undefined
        );
        if (this.startSourceId !== undefined) {
            listener.startFrom(this.startSourceId);
            this.startSourceId = undefined;
        }
        this.toDisposeOnDisable.push(
            listener,
            this.mouseTool.registerListener(listener),
            this.keyTool.registerListener(new RelationCreationToolKeyListener(listener)),
            // Switching to another tool drops a choice still open.
            Disposable.create(() => this.picker.close())
        );
    }

    protected override trackFeedbackEdge(): void {
        const edgeEndListener = new HoldableFeedbackEdgeEndMovingMouseListener(this.anchorRegistry, this.feedbackDispatcher);
        this.edgeEndListener = edgeEndListener;
        this.toDisposeOnDisable.push(
            edgeEndListener,
            this.mouseTool.registerListener(edgeEndListener),
            Disposable.create(() => (this.edgeEndListener = undefined))
        );
    }
}

/**
 * The edge creation tool's feedback, which keeps the loose end of the edge under the mouse - and which
 * can be held where it is. Held while the relation's type is being chosen, so the edge stays on the
 * target it was dropped on however the mouse moves on its way to the picker, or the diagram is scrolled.
 */
class HoldableFeedbackEdgeEndMovingMouseListener extends FeedbackEdgeEndMovingMouseListener {
    protected held = false;

    hold(held: boolean): void {
        this.held = held;
    }

    override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
        return this.held ? [] : super.mouseMove(target, event);
    }
}

class RelationCreationToolMouseListener extends UmlEdgeCreationToolMouseListener {
    /** The server's answers, by the ends asked about, for as long as one relation is being drawn. */
    protected readonly answers = new Map<string, Promise<RelationType[]>>();
    protected readonly settled = new Map<string, RelationType[]>();
    /** Whether the picker is open for the relation drawn, which then decides how it goes on. */
    protected choosing = false;
    /**
     * Whether the tool was started by pressing a shape's arrow, and the release of that press is still to
     * come. The press reached the tool that showed the arrow, not this one, so the release is the first
     * this listener hears of it: dropped on another shape it ends a drag there, and anywhere else - back on
     * the shape, or on the canvas - it is just the end of the click that started the tool.
     */
    protected awaitingStartRelease = false;

    constructor(
        triggerAction: TriggerEdgeCreationAction,
        actionDispatcher: IActionDispatcher,
        typeHintProvider: ITypeHintProvider,
        tool: RelationCreationTool,
        protected readonly picker: RelationTypePicker,
        /** Holds the loose end of the feedback edge where it is, or lets it follow the mouse again. */
        protected readonly holdEdgeEnd: (held: boolean) => void,
        dragSensitivity?: number
    ) {
        super(triggerAction, actionDispatcher, typeHintProvider, tool, dragSensitivity);
    }

    override nonDraggingMouseUp(element: GModelElement, event: MouseEvent): Action[] {
        if (this.choosing) {
            return [];
        }
        if (event.button === 2) {
            this.dispose();
            return [EnableDefaultToolsAction.create()];
        }
        const end = this.currentTarget;
        if (this.awaitingStartRelease && event.button === 0) {
            this.awaitingStartRelease = false;
            if (!end || end.id === this.source) {
                return [];
            }
        }
        if (event.button !== 0 || !end) {
            return [];
        }

        if (!this.isSourceSelected()) {
            void this.relationTypesBetween(end.id).then(relationTypes => {
                if (relationTypes.length > 0 && !this.isSourceSelected() && this.currentTarget === end) {
                    this.selectSource(end.id);
                    // The element under the cursor is now asked about as a target - by itself, a relation to itself.
                    this.allowedTarget = this.canConnect(end, 'target');
                    void this.actionDispatcher.dispatch(this.updateEdgeFeedback());
                }
            });
            return [];
        }

        const sourceId = this.source!;
        const continuous = this.isContinuousMode(element, event);
        const position = { x: event.clientX, y: event.clientY };
        void this.relationTypesBetween(sourceId, end.id).then(relationTypes => {
            if (this.source === sourceId && !this.choosing) {
                this.complete(sourceId, end.id, relationTypes, position, continuous);
            }
        });
        return [];
    }

    /**
     * What Escape does: drops the source picked, or - with none picked yet, or with the type being chosen -
     * leaves the tool, as dismissing the picker does.
     */
    cancel(): Action[] {
        if (this.isSourceSelected() && !this.choosing) {
            this.dispose();
            return [];
        }
        this.picker.close();
        this.dispose();
        return [EnableDefaultToolsAction.create()];
    }

    /**
     * Whether `element` may be the `role` end of some relation. The type hint of the generic edge answers
     * first, for what can be an end at all; what the diagram's relations admit is asked of the server. Until
     * it answers the end is refused and the cursor says the check is pending, which is how the edge
     * creation tool goes about a dynamic edge check as well.
     */
    protected override canConnect(element: GModelElement | undefined, role: 'source' | 'target'): boolean {
        if (!element || !isConnectable(element) || !element.canConnect(this.proxyEdge, role)) {
            return false;
        }
        const ends: [string, string?] = role === 'source' ? [element.id] : [this.source!, element.id];
        const settled = this.settled.get(answerKey(...ends));
        if (settled) {
            return settled.length > 0;
        }

        this.pendingDynamicCheck = true;
        void this.relationTypesBetween(...ends).then(relationTypes => {
            if (this.pendingDynamicCheck && this.currentTarget === element) {
                this.pendingDynamicCheck = false;
                this.allowedTarget = relationTypes.length > 0;
                void this.actionDispatcher.dispatch(this.updateEdgeFeedback());
            }
        });
        return false;
    }

    /**
     * Starts the relation at `sourceId` without it being picked on the canvas - it was picked by pressing
     * one of its arrows (see `RelationHandleTool`), which only shows where a relation may start.
     */
    startFrom(sourceId: string): void {
        this.selectSource(sourceId);
        this.awaitingStartRelease = true;
    }

    protected selectSource(sourceId: string): void {
        this.source = sourceId;
        this.feedbackEdgeFeedback
            .add(
                DrawFeedbackEdgeAction.create({ elementTypeId: this.triggerAction.elementTypeId, sourceId }),
                RemoveFeedbackEdgeAction.create()
            )
            .submit();
    }

    /** Creates the relation the ends admit, or - where they admit several - lets the user choose one. */
    protected complete(sourceId: string, targetId: string, relationTypes: RelationType[], position: Point, continuous: boolean): void {
        if (relationTypes.length === 0) {
            // Refused by the cursor already; the click is not one that can create anything.
            return;
        }
        if (relationTypes.length === 1) {
            this.create(relationTypes[0], sourceId, targetId, continuous);
            return;
        }
        // The edge stays on the target it was dropped on while the type is chosen.
        this.choosing = true;
        this.holdEdgeEnd(true);
        this.picker.open({
            relationTypes,
            position,
            onSelect: relationType => {
                this.choosing = false;
                this.holdEdgeEnd(false);
                this.create(relationType, sourceId, targetId, continuous);
            },
            // Dismissing the choice ends the relation and the tool with it, back to selecting.
            onCancel: () => {
                this.dispose();
                void this.actionDispatcher.dispatch(EnableDefaultToolsAction.create());
            }
        });
    }

    protected create(relationType: RelationType, sourceElementId: string, targetElementId: string, continuous: boolean): void {
        const create = CreateEdgeOperation.create({ elementTypeId: relationType.elementTypeId, sourceElementId, targetElementId });
        if (continuous) {
            // As the edge creation tool does with Ctrl held: the tool stays, ready for the next relation.
            this.dispose();
            void this.actionDispatcher.dispatch(create);
        } else {
            void this.actionDispatcher.dispatchAll([create, EnableDefaultToolsAction.create()]);
        }
    }

    /** The relations that may run from `sourceId`, and to `targetId` where one is given - asked once per pair of ends. */
    protected relationTypesBetween(sourceId: string, targetId?: string): Promise<RelationType[]> {
        const key = answerKey(sourceId, targetId);
        let answer = this.answers.get(key);
        if (!answer) {
            answer = this.actionDispatcher
                .request(RequestRelationTypesAction.create({ sourceElementId: sourceId, targetElementId: targetId }))
                .then(response => response.relationTypes)
                .catch(error => {
                    console.error('Could not determine the relations between the elements picked:', error);
                    return [];
                })
                .then(relationTypes => {
                    this.settled.set(key, relationTypes);
                    return relationTypes;
                });
            this.answers.set(key, answer);
        }
        return answer;
    }

    override dispose(): void {
        this.choosing = false;
        this.awaitingStartRelease = false;
        this.holdEdgeEnd(false);
        // The model may change before the next relation is drawn - what is asked then is asked anew.
        this.answers.clear();
        this.settled.clear();
        super.dispose();
    }
}

function answerKey(sourceId: string, targetId?: string): string {
    return targetId === undefined ? sourceId : `${sourceId}\u0000${targetId}`;
}

class RelationCreationToolKeyListener extends KeyListener {
    constructor(protected readonly listener: RelationCreationToolMouseListener) {
        super();
    }

    override keyDown(_element: GModelElement, event: KeyboardEvent): Action[] {
        return matchesKeystroke(event, 'Escape') ? this.listener.cancel() : [];
    }
}
