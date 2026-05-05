/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { ClassDiagramNodeTypes, CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GCompartmentElement, GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Operation } from '@borkdominik-biguml/uml-model-server/grammar';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { getVisibilitySymbol, InlineCompartment } from './shared-components.js';

export class GOperationNode extends GNode {
    override type = ClassDiagramNodeTypes.OPERATION;
    name: string = 'UNDEFINED PROPERTY NAME';
    returnType: string = 'UNDEFINED';
    visibility: string = 'PUBLIC';
    parameterList: Array<{ key: string; type: string }> = [];
}

export interface GOperationNodeElementProps {
    node: Operation;
}

function formatParamList(params: Array<{ key: string; type: string }>): string {
    return params.map(p => p.key + ':' + p.type).join(', ');
}

export function GOperationNodeElement(props: GOperationNodeElementProps): GModelElement {
    const { node } = props;
    const id = node.__id;

    const visibility = node.visibility ?? 'PUBLIC';
    const parameterList = node.parameters.map(param => ({
        key: param.name!,
        type: param.parameterType?.ref?.name ?? 'Unknown'
    }));

    const opNode = new GOperationNode();
    opNode.id = id;
    opNode.layout = 'hbox';
    opNode.layoutOptions = { resizeContainer: true };
    opNode.name = node.name;
    opNode.visibility = visibility;
    opNode.parameterList = parameterList;
    opNode.args = { build_by: 'dave' };
    opNode.cssClasses = [];
    opNode.children = [];

    // Left side: visibility + name(params)
    const leftSide = (
        <InlineCompartment id={id + '_count_context_4'}>
            <GLabelElement id={id + '_count_context_5'} type={CommonModelTypes.LABEL_TEXT} text={getVisibilitySymbol(visibility)} />
            <GLabelElement
                id={id + '_name_label'}
                type={CommonModelTypes.LABEL_NAME}
                text={node.name + '(' + formatParamList(parameterList) + ')'}
                args={{ highlight: true }}
            />
        </InlineCompartment>
    );
    leftSide.parent = opNode;
    opNode.children.push(leftSide);

    // Right side: empty compartment (matching original behavior)
    const rightSide = (
        <GCompartmentElement
            type={DefaultTypes.COMPARTMENT}
            layout='hbox'
            layoutOptions={{
                hGap: 3,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                resizeContainer: true
            }}
        />
    );
    rightSide.parent = opNode;
    opNode.children.push(rightSide);

    return opNode;
}
