/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import {
    type EditableLabel,
    editLabelFeature,
    type GChildElement,
    getSubType,
    GLabel,
    hoverFeedbackFeature,
    isEdgeLayoutable,
    isEditableLabel,
    type Nameable,
    nameFeature,
    RectangularNode,
    type RenderingContext,
    setAttr,
    ShapeView,
    svg,
    type WithEditableLabel,
    withEditLabelFeature
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

export class GLabeledNode extends RectangularNode implements WithEditableLabel, Nameable {
    static override readonly DEFAULT_FEATURES = [...RectangularNode.DEFAULT_FEATURES, nameFeature, withEditLabelFeature];

    get editableLabel(): (GChildElement & EditableLabel) | undefined {
        const headerComp = this.children.find(element => element.type === 'comp:header');
        if (headerComp) {
            const label = headerComp.children.find(element => element.type === 'label:heading');
            if (label && isEditableLabel(label)) {
                return label;
            }
        }
        return undefined;
    }

    get name(): string {
        if (this.editableLabel) {
            return this.editableLabel.text;
        }
        return this.id;
    }
}

export class GEditableLabel extends GLabel implements EditableLabel {
    static override readonly DEFAULT_FEATURES = [...GLabel.DEFAULT_FEATURES, editLabelFeature, hoverFeedbackFeature];

    hoverFeedback = false;
}

@injectable()
export class GEditableLabelView extends ShapeView {
    override render(element: GEditableLabel, context: RenderingContext): VNode | undefined {
        if (!isEdgeLayoutable(element) && !this.isVisible(element, context)) {
            return undefined;
        }

        const vnode = (
            <text class-sprotty-label={true} class-editable-label={true}>
                {element.text}
            </text>
        );
        const subType = getSubType(element);
        if (subType) {
            setAttr(vnode, 'class', subType);
        }
        return vnode;
    }
}
