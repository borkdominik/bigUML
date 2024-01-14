/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    EditableLabel,
    editLabelFeature, GChildElement, getSubType, GLabel, hoverFeedbackFeature,
    isEdgeLayoutable,
    isEditableLabel,
    Nameable,
    nameFeature,
    RectangularNode,
    RenderingContext, setAttr,
    ShapeView, svg,
    WithEditableLabel,
    withEditLabelFeature
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

export class LabeledNode extends RectangularNode implements WithEditableLabel, Nameable {
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

export class SEditableLabel extends GLabel implements EditableLabel {
    static override readonly DEFAULT_FEATURES = [...GLabel.DEFAULT_FEATURES, editLabelFeature, hoverFeedbackFeature];

    hoverFeedback = false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class SEditableLabelView extends ShapeView {
    override render(element: SEditableLabel, context: RenderingContext): VNode | undefined {
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
