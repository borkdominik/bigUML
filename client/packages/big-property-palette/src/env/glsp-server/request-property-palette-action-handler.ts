/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import {
    RequestActivityPropertyPaletteActionHandler,
    RequestClassPropertyPaletteActionHandler,
    RequestCommunicationPropertyPaletteActionHandler,
    RequestDeploymentPropertyPaletteActionHandler,
    RequestInformationFlowPropertyPaletteActionHandler,
    RequestPackagePropertyPaletteActionHandler,
    RequestStateMachinePropertyPaletteActionHandler,
    RequestUseCasePropertyPaletteActionHandler
} from '@borkdominik-biguml/big-property-palette/gen/glsp-server';
import {
    BEHAVIOR_LABEL_PARTS,
    BEHAVIOR_LABEL_PROPERTY_ID,
    composeBehaviorLabel,
    mergesIntoSamePackage,
    messagesOnLink,
    ORIENTATION_PROPERTY_ID,
    turnableDefaultSize
} from '@borkdominik-biguml/uml-glsp-server';
import { DiagramLanguageMetadata, DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { DiagramLanguageMetadata as DiagramLanguageMetadataType } from '@borkdominik-biguml/uml-glsp-server/vscode';
import {
    isMessage,
    isPackage,
    isPackageMerge,
    isState,
    isStatePart,
    isTransition,
    type Lifeline,
    type Message,
    type Package,
    type StatePart,
    type Transition
} from '@borkdominik-biguml/uml-model-server/grammar';
import { type ActionHandler, CreateEdgeOperation, DeleteElementOperation, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ChoiceProperty, ReferenceProperty, TextProperty } from './components.js';
import { PropertyPaletteChoices } from './property-palette-util.js';

/**
 * Property id of the list of messages sharing a link that the palette offers on a selected message.
 *
 * It is not a property of the message: the messages on a link are the other edges that happen to run
 * between the same two lifelines, which no element owns and none of them stores. It is worked out from
 * the model each time the palette is requested - see `withLinkMessagesProperty`.
 */
const LINK_MESSAGES_PROPERTY_ID = 'linkMessages';

/**
 * Property id of the packages merged into one package that the palette offers on a selected merge.
 *
 * Like the messages on a link, it is not a property of anything: the merges into a package are the
 * other relations that happen to end at it, and each is its own edge. See `withMergedPackagesProperty`.
 */
const MERGED_PACKAGES_PROPERTY_ID = 'mergedPackages';

/**
 * The line an element is drawn as - its `trigger [guard] / effect` notation, or the name it still falls
 * back to. Empty for one that has neither, which is what the user is being asked to fill in.
 */
function behaviorLabelOf(element: StatePart | Transition): string {
    return composeBehaviorLabel(element) ?? element.name ?? '';
}

/**
 * The properties that line is made of, plus the name it falls back to - the ones the single field
 * stands in for. Everything else a transition carries (its kind, its connection points) is a property
 * in its own right and stays as generated.
 */
const BEHAVIOR_LABEL_PROPERTIES = new Set<string>(['name', ...BEHAVIOR_LABEL_PARTS]);

type PerDiagramHandler = new () => ActionHandler;

const HANDLERS_BY_DIAGRAM_TYPE: Record<string, PerDiagramHandler> = {
    CLASS: RequestClassPropertyPaletteActionHandler,
    USE_CASE: RequestUseCasePropertyPaletteActionHandler,
    PACKAGE: RequestPackagePropertyPaletteActionHandler,
    DEPLOYMENT: RequestDeploymentPropertyPaletteActionHandler,
    ACTIVITY: RequestActivityPropertyPaletteActionHandler,
    COMMUNICATION: RequestCommunicationPropertyPaletteActionHandler,
    STATE_MACHINE: RequestStateMachinePropertyPaletteActionHandler,
    INFORMATION_FLOW: RequestInformationFlowPropertyPaletteActionHandler
};

/**
 * Each diagram type gets its own generated `Request<Diagram>PropertyPaletteActionHandler`, but only one
 * handler can ever be bound for `RequestPropertyPaletteAction.KIND`. This dispatches to the handler that
 * matches the currently open diagram instead of hardcoding a single one.
 */
@injectable()
export class RequestPropertyPaletteActionHandler implements ActionHandler {
    actionKinds = [RequestPropertyPaletteAction.KIND];

    @inject(DiagramModelState)
    protected modelState!: DiagramModelState;

    @inject(DiagramLanguageMetadata)
    protected languageMetadata!: DiagramLanguageMetadataType;

    execute(action: RequestPropertyPaletteAction): MaybePromise<any[]> {
        const ctor = this.modelState.diagramType ? HANDLERS_BY_DIAGRAM_TYPE[this.modelState.diagramType] : undefined;
        if (!ctor) {
            return [SetPropertyPaletteAction.create()];
        }

        const handler = new ctor();
        Object.assign(handler, { modelState: this.modelState, languageMetadata: this.languageMetadata });
        return Promise.resolve(handler.execute(action)).then(actions =>
            actions.map(a =>
                this.withMergedPackagesProperty(
                    this.withLinkMessagesProperty(
                        this.withOrientationProperty(
                            this.asBehaviorLabelPalette(
                                this.withComposedPartLabels(this.withoutDeadContainmentProperties(a), action.elementId),
                                action.elementId
                            ),
                            action.elementId
                        ),
                        action.elementId
                    ),
                    action.elementId
                )
            )
        );
    }

    /**
     * Offers the fork/join bars and the branch diamonds the choice of which way they run. They have no
     * such property to generate one from, and deliberately so - their orientation is the shape of their
     * bounds, and a stored copy would contradict them as soon as one was dragged. The value shown is
     * therefore read back off those bounds, and choosing the other one swaps them (see
     * `GenericUpdateOperationHandler`).
     */
    protected withOrientationProperty(action: any, elementId?: string): any {
        if (!SetPropertyPaletteAction.is(action) || !action.palette?.items || !elementId) {
            return action;
        }
        const element = this.modelState.index.findIdElement(elementId);
        const defaultSize = turnableDefaultSize(element);
        if (!defaultSize) {
            return action;
        }

        const stored = this.modelState.index.findSize(elementId);
        const size = stored?.width && stored?.height ? stored : defaultSize;
        const vertical = size.height > size.width;

        return {
            ...action,
            palette: {
                ...action.palette,
                items: [
                    ...action.palette.items,
                    ChoiceProperty({
                        elementId,
                        propertyId: ORIENTATION_PROPERTY_ID,
                        choices: PropertyPaletteChoices.ORIENTATION,
                        choice: vertical ? 'VERTICAL' : 'HORIZONTAL',
                        label: 'Orientation'
                    })
                ]
            }
        };
    }

    /**
     * Offers a selected message the other messages running on the same link, so one can be added to
     * that link or removed from it without going back to the canvas.
     *
     * The link is not an element: the messages between a pair of lifelines are separate edges routed on
     * top of each other, and UML's single connector is what they look like together (see
     * `messagesOnLink`). Nothing owns them, so there is no property to generate this from and nothing
     * else to hang it off - which is why it is worked out here, from whichever message is selected.
     */
    protected withLinkMessagesProperty(action: any, elementId?: string): any {
        if (!SetPropertyPaletteAction.is(action) || !action.palette?.items || !elementId) {
            return action;
        }
        const element = this.modelState.index.findIdElement(elementId);
        if (!isMessage(element)) {
            return action;
        }

        const source = element.source?.ref;
        const target = element.target?.ref;
        if (!source || !target) {
            return action;
        }

        const messageType = this.languageMetadata.convertToElementType('Message');
        const addMessage = (from: Lifeline, to: Lifeline) => ({
            label: `Add Message: ${lifelineLabel(from)} → ${lifelineLabel(to)}`,
            // `CreateEdgeOperation` names the two ends outright. Arming the edge creation tool, which is
            // how the tool palette and the containers' create buttons make a relation, would ask for
            // them to be picked on the canvas - and they are the two ends we already have.
            action: CreateEdgeOperation.create({
                elementTypeId: messageType,
                sourceElementId: from.__id,
                targetElementId: to.__id
            })
        });

        return {
            ...action,
            palette: {
                ...action.palette,
                items: [
                    ...action.palette.items,
                    ReferenceProperty({
                        elementId,
                        propertyId: LINK_MESSAGES_PROPERTY_ID,
                        label: 'Messages on this link',
                        // Without the way through to each message's own palette that a reference list
                        // usually offers: every message here is a message like the one already open,
                        // and following one only arrives at this same list again.
                        isNavigable: false,
                        references: messagesOnLink(element).map(message => ({
                            elementId: message.__id,
                            label: messageLabel(message),
                            // Given as an editable name rather than a plain label, so a message added
                            // here can be named here too: a new one is created unnamed, and its name is
                            // what carries the sequence number a communication diagram is read by.
                            name: message.name ?? '',
                            hint: `${lifelineLabel(message.source?.ref)} → ${lifelineLabel(message.target?.ref)}`,
                            deleteActions: [DeleteElementOperation.create([message.__id])]
                        })),
                        // Both ways round, because which way a message runs is the whole of what its
                        // arrow says and a reply travels back along the link it answers. A message onto
                        // and off the same lifeline has only the one direction to offer.
                        creates:
                            source.__id === target.__id
                                ? [addMessage(source, target)]
                                : [addMessage(source, target), addMessage(target, source)]
                    })
                ]
            }
        };
    }

    /**
     * Offers a selected merge the packages merged into the same package, so that one can be added to
     * the merge or taken off it without drawing another edge.
     *
     * A merge runs between two packages, and a package merged into another is a merge of its own -
     * four packages merged into a fifth are four relations, which is what UML says they are. They are
     * drawn as the single connector UML draws them as (see `packageMergeRoute`), and this is where
     * that connector is worked on: the list is the packages that connector gathers, and adding to it
     * adds another merge running into the same package.
     */
    protected withMergedPackagesProperty(action: any, elementId?: string): any {
        if (!SetPropertyPaletteAction.is(action) || !action.palette?.items || !elementId) {
            return action;
        }
        const element = this.modelState.index.findIdElement(elementId);
        if (!isPackageMerge(element)) {
            return action;
        }

        const merged = element.target?.ref;
        if (!merged) {
            return action;
        }

        const group = mergesIntoSamePackage(element);
        const mergeType = this.languageMetadata.convertToElementType('PackageMerge');
        const alreadyMerged = new Set(group.map(merge => merge.source?.ref?.__id));

        return {
            ...action,
            palette: {
                ...action.palette,
                items: [
                    ...action.palette.items,
                    ReferenceProperty({
                        elementId,
                        propertyId: MERGED_PACKAGES_PROPERTY_ID,
                        label: `Packages merged into ${nodeLabel(merged)}`,
                        // Every entry is a merge like the one already open, so there is nowhere to go.
                        isNavigable: false,
                        references: group.map(merge => ({
                            elementId: merge.__id,
                            label: nodeLabel(merge.source?.ref),
                            deleteActions: [DeleteElementOperation.create([merge.__id])]
                        })),
                        // Every package of the diagram that is not already gathered by this connector,
                        // and not the one they are all merged into - a package cannot merge itself.
                        creates: packagesIn(this.modelState.index.root)
                            .filter(candidate => candidate.__id !== merged.__id && !alreadyMerged.has(candidate.__id))
                            .map(candidate => ({
                                label: `Merge ${nodeLabel(candidate)}`,
                                action: CreateEdgeOperation.create({
                                    elementTypeId: mergeType,
                                    sourceElementId: candidate.__id,
                                    targetElementId: merged.__id
                                })
                            }))
                    })
                ]
            }
        };
    }

    /**
     * The two elements written as `trigger [guard] / effect` - a transition, and one line of a state's
     * second compartment - are typed as that one line rather than as the three properties it is stored
     * as. The generated palette offers those three plus the name the element falls back to, none of
     * which read as the line they add up to.
     *
     * It is also the only way the palette can take a guard at all. A `[` has no terminal in the model
     * grammar, so `e [b]` typed into a `Trigger` field of its own was written to the file verbatim and
     * left it unparseable. Through this field the brackets are notation again: taken apart on the way
     * in by `GenericUpdateOperationHandler` under {@link BEHAVIOR_LABEL_PROPERTY_ID}, which is a
     * property of nothing, exactly as editing the label on the canvas does it.
     */
    protected asBehaviorLabelPalette(action: any, elementId?: string): any {
        if (!SetPropertyPaletteAction.is(action) || !action.palette?.items || !elementId) {
            return action;
        }
        const element = this.modelState.index.findIdElement(elementId);
        if (!element || !(isStatePart(element) || isTransition(element))) {
            return action;
        }

        // One field in the place of the first property it stands in for, so it lands where the name was
        // rather than after everything else the element carries.
        const items: any[] = [];
        let written = false;
        for (const item of action.palette.items) {
            if (!BEHAVIOR_LABEL_PROPERTIES.has(item.propertyId)) {
                items.push(item);
                continue;
            }
            if (written) {
                continue;
            }
            written = true;
            items.push(
                TextProperty({
                    elementId,
                    propertyId: BEHAVIOR_LABEL_PROPERTY_ID,
                    text: behaviorLabelOf(element),
                    // What the notation is called on each: a transition's label, and the text of one line
                    // of a state's second compartment.
                    label: isTransition(element) ? 'Label' : 'Text'
                })
            );
        }

        return { ...action, palette: { ...action.palette, items } };
    }

    /**
     * The parts listed on a state, each under the line it is drawn as rather than under its `name` -
     * which is what the generated list shows, and which a part only carries until the first edit.
     * Without this every part typed into reads as `(unnamed state_part)` in the list it was created
     * from.
     *
     * The `+` is relabelled here too. The generated one is named after the type, `Create State Part`,
     * which repeats the state the list is already shown on.
     */
    protected withComposedPartLabels(action: any, elementId?: string): any {
        if (!SetPropertyPaletteAction.is(action) || !action.palette?.items || !elementId) {
            return action;
        }
        const element = this.modelState.index.findIdElement(elementId);
        if (!element || !isState(element)) {
            return action;
        }
        const parts = new Map((element.parts ?? []).map(part => [part.__id, part]));

        return {
            ...action,
            palette: {
                ...action.palette,
                items: action.palette.items.map((item: any) =>
                    item.propertyId !== 'parts' || !item.references
                        ? item
                        : {
                              ...item,
                              creates: (item.creates ?? []).map((create: any) => ({ ...create, label: 'Create Part' })),
                              references: item.references.map((reference: any) => {
                                  const part = parts.get(reference.elementId);
                                  if (!part) {
                                      return reference;
                                  }
                                  const label = behaviorLabelOf(part);
                                  return { ...reference, label, name: label };
                              })
                          }
                )
            }
        };
    }

    /**
     * Containment properties the palette generates a list and a `+` for, which nothing on the canvas
     * could show the result of. Offering them is worse than offering nothing: the element is written
     * into the file, and there it stays, listed nowhere and selectable by nothing.
     *
     * - A subject's `useCases`, because a use case only ever renders as a flat `diagram.entities`
     *   sibling positioned by canvas overlap, never as a child of the subject that contains it.
     *
     * Removed here rather than in the generated handlers, which are written from the definitions and
     * would lose the exclusion on the next regeneration.
     */
    protected withoutDeadContainmentProperties(action: any): any {
        if (!SetPropertyPaletteAction.is(action) || !action.palette?.items) {
            return action;
        }

        const hidden = new Set<string>(['useCases']);

        return {
            ...action,
            palette: {
                ...action.palette,
                items: action.palette.items.filter((item: any) => !hidden.has(item.propertyId))
            }
        };
    }
}

/** A lifeline as it reads in the direction of a message; unnamed ones still have to be told apart. */
function lifelineLabel(lifeline: Lifeline | undefined): string {
    return lifeline?.name?.trim() || '(unnamed lifeline)';
}

/** An element as it reads in a list of them; an unnamed one still has to be told apart. */
function nodeLabel(node: { name?: string } | undefined): string {
    return node?.name?.trim() || '(unnamed)';
}

/**
 * The packages of a diagram, those nested in another package included: a package merged into another
 * can be one drawn inside a third, and only a package can hold one.
 */
function packagesIn(container: unknown): Package[] {
    const entities = (container as { entities?: unknown[] } | undefined)?.entities;
    if (!Array.isArray(entities)) {
        return [];
    }
    return entities.flatMap(entity => (isPackage(entity) ? [entity, ...packagesIn(entity)] : []));
}

/** Only reached where the message list is shown without its name fields; see `withLinkMessagesProperty`. */
function messageLabel(message: Message): string {
    return message.name?.trim() || '(unnamed message)';
}
