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
    hasArgs,
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

        const lines = this.lines(element);
        const vnode =
            lines.length > 1 ? (
                <text class-sprotty-label={true} class-editable-label={true}>
                    {lines.map((line, index) => (
                        <tspan x={0} dy={index === 0 ? 0 : '1.15em'}>
                            {line}
                        </tspan>
                    ))}
                </text>
            ) : (
                <text class-sprotty-label={true} class-editable-label={true}>
                    {element.text}
                </text>
            );

        if (lines.length > 1) {
            // Each line is drawn about x=0 so that the lines are centred on one another. The block
            // that makes starts left of its own origin, which is what a label's alignment is for -
            // the measured bounds are shifted back over it, so the layout still places it correctly.
            setAttr(vnode, 'text-anchor', 'middle');
        }

        const subType = getSubType(element);
        if (subType) {
            setAttr(vnode, 'class', subType);
        }
        return vnode;
    }

    /**
     * The name, over as many lines as it is written on. A shape asks for this by marking the label
     * `wrapAtSpaces` (see `CompartmentHeader`): a name of several words is then written a word to a
     * line rather than on one long line, so the shape reads at whatever width it is dragged to.
     *
     * The break is in the drawing only - the label's own text is left whole, so renaming still
     * offers the name as it is written in the model.
     */
    protected lines(element: GEditableLabel): string[] {
        if (!hasArgs(element) || element.args['wrapAtSpaces'] !== true) {
            return [element.text];
        }
        const words = element.text.split(/\s+/).filter(word => word.length > 0);
        return words.length > 0 ? words : [element.text];
    }
}
