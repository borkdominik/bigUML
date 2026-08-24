/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ClassDiagramNodeTypes, PACKAGE_TAB_HEIGHT } from '@borkdominik-biguml/uml-glsp-server';
import { GCompartmentElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { isClass, isPackage, type Package } from '@borkdominik-biguml/uml-model-server/grammar';
import { DefaultTypes, type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { createClassElement } from './class.element.js';
import type { ElementContext } from './core/element-context.js';
import { CompartmentHeader } from './core/index.js';

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

/** What a vbox leaves around its contents by default, and what a package keeps below its tab. */
const CONTENT_PADDING = 5;

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
    }
    // Everything the package holds starts below the tab the view draws along its top edge, which is
    // part of the shape rather than something laid over it.
    packageNode.layoutOptions = {
        paddingTop: PACKAGE_TAB_HEIGHT + CONTENT_PADDING,
        ...(size ? { prefWidth: size.width, prefHeight: size.height } : {})
    };

    // No `<<package>>` above the name: the tab the shape is drawn with is what says it is a package,
    // and UML writes the stereotype only where the shape does not already say so.
    const header = <CompartmentHeader id={id} name={node.name} />;
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

export function createPackageElement(ctx: ElementContext<Package>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);

    const freeformChildren: GModelElement[] = [];
    if (ctx.node.entities?.length > 0) {
        for (const entity of ctx.node.entities) {
            if (isPackage(entity)) {
                freeformChildren.push(createPackageElement({ ...ctx, node: entity }));
            } else if (isClass(entity)) {
                freeformChildren.push(createClassElement({ ...ctx, node: entity }));
            }
        }
    }

    return (
        <GPackageNodeElement
            node={ctx.node}
            position={position}
            size={size}
            freeformChildren={freeformChildren.length > 0 ? freeformChildren : undefined}
        />
    );
}
