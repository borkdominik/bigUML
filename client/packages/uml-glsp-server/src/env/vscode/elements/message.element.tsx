/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { messagesOnLink, representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { GEdgeElement, GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { type Message } from '@borkdominik-biguml/uml-model-server/grammar';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import type { GEdge, GEdgePlacement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';

/**
 * The label type the communication diagram module maps to `MessageArrowLabelView`, which writes the
 * message beside the link with an arrow under it showing which way it runs.
 *
 * A message used to be given the same `LABEL_EDGE_NAME` every other relation gets, so it was drawn as
 * a plain caption and the arrow view - which has been in the client the whole time - was never
 * reached for any label. The two halves have to name the same type for it to be used.
 */
const MESSAGE_ARROW_LABEL_TYPE = representationTypeId('Communication', DefaultTypes.LABEL, 'message-arrow-edge-name');

/** Clearance between the link and the arrow of a message drawn beside it. */
const BASE_OFFSET = 7;

/**
 * How far along the link the message at `index` sits, as a fraction of the link's length.
 *
 * Messages are placed two to a spot - one above the line, one below - so a pair shares a point along
 * the link without its two arrows meeting. The first pair keeps the middle however many messages the
 * link carries, which is where UML draws a link's one or two messages; further pairs step outwards
 * from there, taking the two directions in turn, so the link fills from the centre rather than from
 * one end. The step is sized from the number of pairs, which keeps even the outermost one on the link
 * instead of over a lifeline.
 */
function messagePosition(index: number, count: number): number {
    const pair = Math.floor(index / 2);
    if (pair === 0) {
        return 0.5;
    }

    // How many steps out this pair goes, and how many the furthest one does. Pairs share each step,
    // one to either side of the middle, so `pairs - 1` of them reach half that many steps out.
    // Taking the larger of the two keeps a message the link does not list - `index` past `count` -
    // on the link rather than beyond its end.
    const level = Math.ceil(pair / 2);
    const levels = Math.max(Math.ceil((Math.ceil(count / 2) - 1) / 2), level);
    const direction = pair % 2 === 1 ? -1 : 1;

    return 0.5 + (direction * level * 0.5) / (levels + 1);
}

/**
 * Beside the link, written upright, the messages in pairs along it and on alternating sides.
 *
 * Messages sharing a link are separate edges routed one on top of the other, so a placement they all
 * agreed on would draw every arrow in the same spot. `messagePosition` separates the pairs along the
 * line and alternating sides separates the two messages of a pair across it, so no two arrows meet
 * even where a link is short.
 *
 * `side: 'bottom'` places a label *above* the line and `'top'` below it - see the note in
 * `core/edge-label.tsx` on why the sides read inverted. The label is never turned along the edge,
 * because it draws its own arrow and a sequence number set sideways is not worth the tidiness.
 *
 * The client reads `side` and `offset` itself rather than leaving them to GLSP's edge layout, so that
 * a message is held off the link by its arrow instead of by the corner of its own text - see
 * `MessageArrowLayoutPostprocessor`. `position` is the one part of the placement GLSP still applies.
 */
function messagePlacement(index: number, count: number): GEdgePlacement {
    const above = index % 2 === 0;
    return {
        rotate: false,
        side: above ? 'bottom' : 'top',
        position: messagePosition(index, count),
        offset: BASE_OFFSET
    };
}

export function createMessageRelation(ctx: ElementContext<Message>): GEdge {
    // `indexOf` rather than a counter, so a message its own link does not list falls back to the first
    // place along it instead of to one past the end.
    const onLink = messagesOnLink(ctx.node);
    const index = Math.max(0, onLink.indexOf(ctx.node));

    return (
        <GEdgeElement
            id={ctx.node.__id}
            type={ctx.elementType}
            sourceId={ctx.node.source!.ref!.__id}
            targetId={ctx.node.target!.ref!.__id}
            // No arrow head on the link: it is the association between two lifelines, and the direction
            // belongs to the messages running along it, each of which draws its own.
            cssClasses={['uml-edge']}
        >
            {/* Emitted even when the message has no name, unlike an ordinary relation label - the arrow
                is the point of it, and a message with no name still runs one way rather than the other. */}
            <GLabelElement
                id={ctx.node.__id + '_name_label'}
                type={MESSAGE_ARROW_LABEL_TYPE}
                text={ctx.node.name ?? ''}
                args={{ highlight: true }}
                edgePlacement={messagePlacement(index, onLink.length)}
            />
        </GEdgeElement>
    ) as GEdge;
}
