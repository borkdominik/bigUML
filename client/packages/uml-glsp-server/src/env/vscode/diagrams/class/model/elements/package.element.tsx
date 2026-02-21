/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Package } from '@borkdominik-biguml/model-server/grammar';
import { GCompartmentElement } from '@borkdominik-biguml/uml-glsp-jsx';
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { DefaultTypes, type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { CompartmentHeader } from './shared-components.js';

export class GPackageNode extends GNode {
    override type = ClassDiagramNodeTypes.PACKAGE;
    override layout = 'vbox';
    name: string = 'UNDEFINED CLASS NAME';
    uri: string = 'UNDEFINED URI';
    visibility: string = 'PUBLIC';
}

export interface GPackageNodeElementProps {
    node: Package;
    position?: Point;
    size?: Dimension;
    freeformChildren?: GModelElement[];
}

export function GPackageNodeElement(props: GPackageNodeElementProps): GModelElement {
    const { node, position, size, freeformChildren } = props;
    const id = node.__id;

    const packageNode = new GPackageNode();
    packageNode.id = id;
    packageNode.name = node.name;
    packageNode.uri = node.uri ?? 'UNDEFINED URI';
    packageNode.visibility = node.visibility ?? 'PUBLIC';
    packageNode.cssClasses = ['uml-node', 'uml-package-node'];
    packageNode.children = [];

    if (position) {
        packageNode.position = position;
    }
    if (size) {
        packageNode.size = size;
        packageNode.layoutOptions = { prefWidth: size.width, prefHeight: size.height };
    }

    const header = <CompartmentHeader id={id} name={node.name} stereotype='package' />;
    header.parent = packageNode;
    packageNode.children.push(header);

    if (freeformChildren && freeformChildren.length > 0) {
        const freeformComp = (
            <GCompartmentElement
                id={id + '_freeform'}
                type={DefaultTypes.COMPARTMENT}
                layout='freeform'
                args={{ 'children-container': true, divider: true }}
                layoutOptions={{ hAlign: 'left', resizeContainer: true }}
            >
                {freeformChildren}
            </GCompartmentElement>
        );
        freeformComp.parent = packageNode;
        packageNode.children.push(freeformComp);
    }

    return packageNode;
}
