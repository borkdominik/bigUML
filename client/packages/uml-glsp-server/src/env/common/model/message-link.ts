/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isMessage, type Message } from '@borkdominik-biguml/uml-model-server/grammar';

/**
 * The link a message runs on: the unordered pair of lifelines at its ends.
 *
 * Unordered on purpose. A reply running back the other way is drawn on the same link as the call it
 * answers and has to be counted as sharing it. The messages are separate edges in this model, routed
 * between the same two lifelines and so drawn one exactly on top of the other - which is what makes a
 * link carrying several messages read as the single line UML draws, provided the labels are kept apart.
 */
export function messageLinkKey(message: Message): string {
    const source = message.source?.ref?.__id ?? '';
    const target = message.target?.ref?.__id ?? '';
    return source < target ? `${source}|${target}` : `${target}|${source}`;
}

/**
 * Every message running on the same link as this one, in model order and including it, so the first
 * message keeps its place as later ones are added rather than every label moving whenever one is
 * inserted.
 */
export function messagesOnLink(message: Message): Message[] {
    // Read through `$containerProperty` rather than naming the array: a message is owned by whichever
    // property holds it, which is `Interaction.messages` for one created inside an interaction and the
    // diagram's own relation list for one drawn on the canvas. Naming either would silently report a
    // link of one for every message stored in the other.
    // The container is a `CommunicationDiagram | Interaction`, which is exactly the point - indexing it
    // by the property that holds this message is what covers both without naming either.
    const container = message.$container as unknown as Record<string, unknown> | undefined;
    const siblings = message.$containerProperty ? container?.[message.$containerProperty] : undefined;
    if (!Array.isArray(siblings)) {
        return [message];
    }

    const key = messageLinkKey(message);
    const onLink = siblings.filter((relation): relation is Message => isMessage(relation) && messageLinkKey(relation) === key);
    // A message its own container does not list would otherwise come back as a link with no messages
    // on it, which no caller can place or count against.
    return onLink.length > 0 ? onLink : [message];
}
