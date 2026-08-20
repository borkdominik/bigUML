/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { composeBehaviorLabel, CommonModelTypes, StateMachineDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { StatePart } from '@borkdominik-biguml/uml-model-server/grammar';
import { GNode, type GModelElement } from '@eclipse-glsp/server';

/**
 * One line of a state's second compartment, drawn as the text it holds and nothing else - `do / print`.
 *
 * A node of its own rather than a bare label on the state, so that the line is a thing on the canvas:
 * it can be clicked, deleted with the keyboard, and navigated to from the state's property panel, all
 * of which go by the id of an element the model index knows. The state that owns it draws the divider
 * above it and gives it its place; a part has no shape and no bounds of its own.
 */
export class GStatePartNode extends GNode {
    override type = StateMachineDiagramNodeTypes.STATE_PART;
    name: string = 'UNDEFINED STATE PART';
}

export interface GStatePartNodeElementProps {
    node: StatePart;
}

export function GStatePartNodeElement(props: GStatePartNodeElementProps): GModelElement {
    const { node } = props;
    // A part drawn before anything was typed into it carries its text in `name`, so that is what stays
    // on screen until one of the three notation parts is set - the same fallback a transition's label
    // has, see `createTransitionRelation`.
    const text = composeBehaviorLabel(node) ?? node.name ?? '';

    const partNode = new GStatePartNode();
    partNode.id = node.__id;
    partNode.name = text;
    partNode.layout = 'hbox';
    // Sized to the text and no more: the line is written on the compartment the state laid out, so any
    // padding of its own would show as an indent on one line and not on the next.
    partNode.layoutOptions = {
        resizeContainer: true,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
    };
    partNode.cssClasses = ['uml-font-member'];

    // `LABEL_NAME` with `highlight`, which is what makes the line editable in the diagram itself: the
    // label's id carries the part's own id as a prefix, which is how the edit finds its way back to the
    // part - and from there into the three properties the line is stored as, see
    // `GenericLabelEditOperationHandler`.
    const label = (
        <GLabelElement id={node.__id + '_name_label'} type={CommonModelTypes.LABEL_NAME} text={text} args={{ highlight: true }} />
    ) as GModelElement;
    label.parent = partNode;
    partNode.children = [label];

    return partNode;
}
