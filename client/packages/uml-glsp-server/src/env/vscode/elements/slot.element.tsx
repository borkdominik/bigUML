/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
/** @jsxImportSource @borkdominik-biguml/uml-glsp-server/jsx */
import { ClassDiagramNodeTypes, CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Slot } from '@borkdominik-biguml/uml-model-server/grammar';
import { GNode, type GModelElement } from '@eclipse-glsp/server';

export class GSlotNode extends GNode {
    override type = ClassDiagramNodeTypes.SLOT;
    override layout = 'hbox';
}

export interface GSlotNodeElementProps {
    node: Slot;
}

export function GSlotNodeElement(props: GSlotNodeElementProps): GModelElement {
    const { node } = props;
    const id = node.__id;

    const slotNode = new GSlotNode();
    slotNode.id = id;
    slotNode.layoutOptions = { resizeContainer: true, hGap: 3 };
    slotNode.args = { build_by: 'dave' };
    slotNode.cssClasses = [];
    slotNode.children = [];

    // UML object notation: `feature = value`, the values of a multi-valued slot separated by commas.
    const featureLabel = <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={node.definingFeature?.ref?.name ?? node.name ?? ''} />;
    featureLabel.parent = slotNode;
    slotNode.children.push(featureLabel);

    const values = (node.values ?? []).map(value => value.value ?? value.name ?? '').filter(value => value.length > 0);
    if (values.length > 0) {
        const valuesLabel = <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={`= ${values.join(', ')}`} />;
        valuesLabel.parent = slotNode;
        slotNode.children.push(valuesLabel);
    }

    return slotNode;
}
