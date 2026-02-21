/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { EnumerationLiteral } from '@borkdominik-biguml/model-server/grammar';
import { GLabelElement } from '@borkdominik-biguml/uml-glsp-jsx';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { ModelTypes } from '../model-types.js';

export class GEnumerationLiteralNode extends GNode {
    override type = ModelTypes.ENUMERATION_LITERAL;
    override layout = 'hbox';
    name: string = 'UNDEFINED ENUMERATION LITERAL NAME';
}

export interface GEnumerationLiteralNodeElementProps {
    node: EnumerationLiteral;
}

export function GEnumerationLiteralNodeElement(props: GEnumerationLiteralNodeElementProps): GModelElement {
    const { node } = props;
    const id = node.__id;

    const litNode = new GEnumerationLiteralNode();
    litNode.id = id;
    litNode.name = node.name;
    litNode.layoutOptions = { resizeContainer: 'true' };
    litNode.args = { build_by: 'dave' };
    litNode.cssClasses = [];
    litNode.children = [];

    const nameLabel = <GLabelElement id={id + '_name_label'} type={ModelTypes.LABEL_NAME} text={node.name} args={{ highlight: true }} />;
    nameLabel.parent = litNode;
    litNode.children.push(nameLabel);

    return litNode;
}
