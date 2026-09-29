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
import type { Operation, Parameter } from '@borkdominik-biguml/uml-model-server/grammar';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { propertyLabelId } from '../notation/label-ids.js';
import { typeNameOf } from '../notation/typed-element.js';
import { getVisibilitySymbol, InlineCompartment } from './core/index.js';

export class GOperationNode extends GNode {
    override type = ClassDiagramNodeTypes.OPERATION;
    name: string = 'UNDEFINED PROPERTY NAME';
    returnType: string = 'UNDEFINED';
    visibility: string = 'NONE';
    isAbstract: boolean = false;
    parameterList: Array<{ key: string; type: string }> = [];
}

export interface GOperationNodeElementProps {
    node: Operation;
}

/** A row of labels laid out side by side, `gap` apart, starting `indent` in from where it is placed. */
function SignatureRow(props: { id?: string; gap: number; indent?: number; children?: GModelElement[] }): GModelElement {
    return (
        <GCompartmentElement
            id={props.id}
            type={DefaultTypes.COMPARTMENT}
            layout='hbox'
            layoutOptions={{
                hGap: props.gap,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: props.indent ?? 0,
                paddingRight: 0,
                resizeContainer: true
            }}
        >
            {props.children}
        </GCompartmentElement>
    );
}

/**
 * The type of a parameter as a label of its own, so that it is edited on its own: its id names the
 * parameter and the property (see `labelProperty`), and the edit is written back to that parameter.
 */
function ParameterTypeLabel(props: { parameter: Parameter }): GModelElement {
    return (
        <GLabelElement
            id={propertyLabelId(props.parameter.__id, 'parameterType')}
            type={CommonModelTypes.LABEL_NAME}
            text={typeNameOf(props.parameter, 'parameterType') ?? 'Unknown'}
            args={{ highlight: true }}
        />
    );
}

/** `name:Type`, or just `Type` for a parameter left unnamed - each part editable on its own. */
function ParameterSignature(props: { parameter: Parameter; indent: number }): GModelElement {
    const { parameter } = props;
    const labels: GModelElement[] = [];
    if (parameter.name) {
        labels.push(
            <GLabelElement
                id={propertyLabelId(parameter.__id, 'name')}
                type={CommonModelTypes.LABEL_NAME}
                text={parameter.name}
                args={{ highlight: true }}
            />,
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text=':' />
        );
    }
    labels.push(<ParameterTypeLabel parameter={parameter} />);
    return (
        <SignatureRow id={parameter.__id + '_signature'} gap={0} indent={props.indent}>
            {labels}
        </SignatureRow>
    );
}

export function GOperationNodeElement(props: GOperationNodeElementProps): GModelElement {
    const { node } = props;
    const id = node.__id;

    const visibility = node.visibility ?? 'NONE';
    const isAbstract = node.isAbstract ?? false;
    // UML writes the return parameter after the list rather than in it: `name(a:T): R`.
    const returnParameter = node.parameters.find(param => param.direction === 'RETURN');
    const returnType = returnParameter ? (typeNameOf(returnParameter, 'parameterType') ?? 'Unknown') : undefined;
    const parameters = node.parameters.filter(param => param !== returnParameter);
    const parameterList = parameters.map(param => ({
        key: param.name ?? '',
        type: typeNameOf(param, 'parameterType') ?? 'Unknown'
    }));

    const opNode = new GOperationNode();
    opNode.id = id;
    opNode.layout = 'hbox';
    opNode.layoutOptions = { resizeContainer: true };
    opNode.name = node.name;
    opNode.visibility = visibility;
    opNode.isAbstract = isAbstract;
    opNode.parameterList = parameterList;
    opNode.returnType = returnType ?? '';
    opNode.args = { build_by: 'dave' };
    opNode.cssClasses = ['uml-font-member'];
    opNode.children = [];

    // Left side: visibility + name(params): ReturnType. A visibility of `NONE` renders no symbol at all — the
    // label is left out entirely so the name does not keep the compartment gap as an indent.
    const visibilitySymbol = getVisibilitySymbol(visibility);

    // The signature is built from separate labels rather than written as one, so that a double click
    // edits the part under the mouse - the operation's name, a parameter's name or type, the return
    // type - instead of the whole line. Each editable label's id names the element and the property it
    // writes back to (see `labelProperty`); the punctuation between them is plain text.
    const signatureParts: GModelElement[] = [
        <GLabelElement
            id={propertyLabelId(id, 'name')}
            type={CommonModelTypes.LABEL_NAME}
            text={node.name}
            args={{ highlight: true }}
            cssClasses={isAbstract ? ['uml-font-italic'] : undefined}
        />,
        <GLabelElement type={CommonModelTypes.LABEL_TEXT} text='(' />
    ];
    parameters.forEach((parameter, index) => {
        if (index > 0) {
            signatureParts.push(<GLabelElement type={CommonModelTypes.LABEL_TEXT} text=',' />);
        }
        signatureParts.push(<ParameterSignature parameter={parameter} indent={index > 0 ? 4 : 0} />);
    });
    signatureParts.push(<GLabelElement type={CommonModelTypes.LABEL_TEXT} text=')' />);
    if (returnParameter) {
        signatureParts.push(
            <SignatureRow gap={4}>
                {[<GLabelElement type={CommonModelTypes.LABEL_TEXT} text=':' />, <ParameterTypeLabel parameter={returnParameter} />]}
            </SignatureRow>
        );
    }
    const signature = (
        <SignatureRow id={id + '_signature'} gap={0}>
            {signatureParts}
        </SignatureRow>
    );

    const leftSide = (
        <InlineCompartment id={id + '_count_context_4'}>
            {visibilitySymbol ? (
                <GLabelElement id={id + '_count_context_5'} type={CommonModelTypes.LABEL_TEXT} text={visibilitySymbol} />
            ) : null}
            {signature}
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
