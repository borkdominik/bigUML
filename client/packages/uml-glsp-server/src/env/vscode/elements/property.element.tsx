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
import type { Property } from '@borkdominik-biguml/uml-model-server/grammar';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { getVisibilitySymbol, InlineCompartment } from './core/index.js';

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

    const propertyTypeName = node.propertyType;
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
    propNode.cssClasses = ['uml-font-member'];
    propNode.children = [];

    // Left side: visibility + name. A visibility of `NONE` renders no symbol at all — the label
    // is left out entirely so the name does not keep the compartment gap as an indent.
    const visibilitySymbol = getVisibilitySymbol(visibility);
    const leftSide = (
        <InlineCompartment id={id + '_count_context_1'}>
            {visibilitySymbol ? (
                <GLabelElement id={id + '_count_context_2'} type={CommonModelTypes.LABEL_TEXT} text={visibilitySymbol} />
            ) : null}
            <GLabelElement id={id + '_name_label'} type={CommonModelTypes.LABEL_NAME} text={node.name!} args={{ highlight: true }} />
        </InlineCompartment>
    );
    leftSide.parent = propNode;
    propNode.children.push(leftSide);

    // Right side: : type[multiplicity] (only if type exists)
    const rightSideChildren: GModelElement[] = [];
    if (propertyTypeName) {
        const colonLabel = <GLabelElement type={CommonModelTypes.LABEL_TEXT} text=':' />;
        const detailComp = (
            <GCompartmentElement
                type={DefaultTypes.COMPARTMENT}
                layout='hbox'
                layoutOptions={{
                    // No gap: the bracketed multiplicity reads as part of the type (`String[0..1]`).
                    hGap: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    resizeContainer: true
                }}
            >
                <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={propertyTypeName} />
                {multiplicity !== '1' ? <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={`[${multiplicity}]`} /> : null}
            </GCompartmentElement>
        );
        rightSideChildren.push(colonLabel, detailComp);
    }

    const rightSide = <InlineCompartment id={id + 'right_side'}>{rightSideChildren}</InlineCompartment>;
    rightSide.parent = propNode;
    propNode.children.push(rightSide);

    return propNode;
}

/**
 * One property written on a frame as `name: Type`, the way an activity lists its parameters straight
 * under its own name.
 *
 * Deliberately not `GPropertyNodeElement`, which builds the member row a class shows. That row always
 * carries a visibility symbol and, when no type is set, an empty right-hand compartment - and an empty
 * compartment measures to no valid bounds, which takes the row it belongs to out of the frame's vbox
 * instead of stacking it under the name. A frame writes a heading rather than a member list, so the
 * symbol is left off and the type side is built only once there is a type to write.
 */
export function GPropertyRowElement(props: { node: Property; type: string }): GModelElement {
    const { node } = props;
    const id = node.__id;

    const propertyTypeName = node.propertyType;
    const multiplicity = node.multiplicity ?? '1';

    const rowNode = new GPropertyNode();
    rowNode.type = props.type;
    rowNode.id = id;
    rowNode.layout = 'hbox';
    rowNode.layoutOptions = {
        resizeContainer: true,
        // A layouter reads an element's options by walking up its parents, so a row written on a frame
        // inherits that frame's own floor and padding unless it sets its own. An activity's frame carries
        // `minWidth`/`minHeight` so it can never be dragged onto its name - inherited, those turned every
        // row into a block of the frame's minimum size with its text centred in the middle of it, which is
        // what pushed the name far below the title and drew a box the size of the gap.
        minWidth: 0,
        minHeight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
    };
    rowNode.name = node.name!;
    rowNode.propertyType = propertyTypeName;
    rowNode.visibility = node.visibility ?? 'PUBLIC';
    rowNode.multiplicity = multiplicity;
    rowNode.cssClasses = ['uml-font-member'];
    // A row is text written on the frame, not a shape of its own. `NamedElementView` paints its rounded
    // background behind any node that does not say who built it, so leaving this off draws a box around
    // every parameter - the class's own property row sets it for exactly the same reason.
    rowNode.args = { build_by: 'property-row' };
    rowNode.children = [];

    // `highlight` is what makes the name the part of the row that answers to a click, which is how a
    // class's property row is put together too.
    const nameSide = (
        <InlineCompartment id={id + '_property_name'}>
            <GLabelElement id={id + '_name_label'} type={CommonModelTypes.LABEL_NAME} text={node.name!} args={{ highlight: true }} />
        </InlineCompartment>
    );
    nameSide.parent = rowNode;
    rowNode.children.push(nameSide);

    if (propertyTypeName) {
        const typeSide = (
            <InlineCompartment id={id + '_property_type'}>
                <GLabelElement type={CommonModelTypes.LABEL_TEXT} text=':' />
                <GCompartmentElement
                    type={DefaultTypes.COMPARTMENT}
                    layout='hbox'
                    layoutOptions={{
                        // No gap: the bracketed multiplicity reads as part of the type (`String[0..1]`).
                        hGap: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        resizeContainer: true
                    }}
                >
                    <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={propertyTypeName} />
                    {multiplicity !== '1' ? <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={`[${multiplicity}]`} /> : null}
                </GCompartmentElement>
            </InlineCompartment>
        );
        typeSide.parent = rowNode;
        rowNode.children.push(typeSide);
    }

    return rowNode;
}
