/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import type { Property } from '@borkdominik-biguml/model-server/grammar';
import { GCompartmentElement, GLabelElement } from '../../../../../jsx/index.js';
import { ClassDiagramNodeTypes, CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { getVisibilitySymbol, InlineCompartment } from './shared-components.js';

export class GPropertyNode extends GNode {
    override type = ClassDiagramNodeTypes.PROPERTY;
    name: string = 'UNDEFINED PROPERTY NAME';
    propertyType?: string;
    visibility: string = 'PUBLIC';
    multiplicity: string = '1';
}

export interface GPropertyNodeElementProps {
    node: Property;
}

export function GPropertyNodeElement(props: GPropertyNodeElementProps): GModelElement {
    const { node } = props;
    const id = node.__id;

    const propertyTypeName = node.propertyType?.ref?.name;
    const visibility = node.visibility ?? 'PUBLIC';
    const multiplicity = node.multiplicity ?? '1';

    const propNode = new GPropertyNode();
    propNode.id = id;
    propNode.layout = 'hbox';
    propNode.layoutOptions = { resizeContainer: true };
    propNode.name = node.name!;
    propNode.propertyType = propertyTypeName;
    propNode.visibility = visibility;
    propNode.multiplicity = multiplicity;
    propNode.args = { build_by: 'dave' };
    propNode.cssClasses = [];
    propNode.children = [];

    // Left side: visibility + name
    const leftSide = (
        <InlineCompartment id={id + '_count_context_1'}>
            <GLabelElement id={id + '_count_context_2'} type={CommonModelTypes.LABEL_TEXT} text={getVisibilitySymbol(visibility)} />
            <GLabelElement id={id + '_name_label'} type={CommonModelTypes.LABEL_NAME} text={node.name!} args={{ highlight: true }} />
        </InlineCompartment>
    );
    leftSide.parent = propNode;
    propNode.children.push(leftSide);

    // Right side: : type multiplicity (only if type exists)
    const rightSideChildren: GModelElement[] = [];
    if (propertyTypeName) {
        const colonLabel = <GLabelElement type={CommonModelTypes.LABEL_TEXT} text=':' />;
        const detailComp = (
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
            >
                <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={propertyTypeName} />
                {multiplicity !== '1' ? <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={multiplicity} /> : null}
            </GCompartmentElement>
        );
        rightSideChildren.push(colonLabel, detailComp);
    }

    const rightSide = <InlineCompartment id={id + 'right_side'}>{rightSideChildren}</InlineCompartment>;
    rightSide.parent = propNode;
    propNode.children.push(rightSide);

    return propNode;
}
