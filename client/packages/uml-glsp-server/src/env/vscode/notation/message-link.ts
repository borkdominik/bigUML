/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isMessage, type Message } from '@borkdominik-biguml/uml-model-server/grammar';
import { siblingsOf } from './siblings.js';

/** The link a message runs along, keyed by its two lifelines in either order. */
function messageLinkKey(message: Message): string {
    const source = message.source?.ref?.__id ?? '';
    const target = message.target?.ref?.__id ?? '';
    return source < target ? `${source}|${target}` : `${target}|${source}`;
}

/**
 * Every message on the same link as this one, this one included, in the order the model lists them -
 * which is the order they are spread along the link in.
 */
export function messagesOnLink(message: Message): Message[] {
    const key = messageLinkKey(message);
    const onLink = siblingsOf(message).filter((relation): relation is Message => isMessage(relation) && messageLinkKey(relation) === key);
    // A message its own container does not list would otherwise come back as a link with no messages
    // on it, which no caller can place or count against.
    return onLink.length > 0 ? onLink : [message];
}
