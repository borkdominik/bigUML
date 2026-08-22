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

        if (lines.length > 1 && this.centersLines(element)) {
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
     * The text, over as many lines as it is written on. A shape asks for a break in one of two ways, and
     * for neither of them on any label it does not mark.
     *
     * `wrapAtSpaces` (see `CompartmentHeader`) writes a name of several words a word to a line, so the
     * shape reads at whatever width it is dragged to. `wrapAtColumns` fills each line instead, up to the
     * given number of characters - which is what a block of writing wants, and what a note asks for (see
     * `GNoteNodeElement`, which works the count out from the width the note is drawn at).
     *
     * The break is in the drawing only - the label's own text is left whole, so retyping still offers
     * what is written in the model rather than the first line of it.
     */
    protected lines(element: GEditableLabel): string[] {
        if (!hasArgs(element)) {
            return [element.text];
        }
        if (element.args['wrapAtSpaces'] === true) {
            const words = splitWords(element.text);
            return words.length > 0 ? words : [element.text];
        }
        const columns = element.args['wrapAtColumns'];
        return typeof columns === 'number' && columns > 0 ? fillLines(element.text, columns) : [element.text];
    }

    /**
     * Whether the lines of a label written over several are centred on one another, or set from a common
     * left margin.
     *
     * A name is centred: it labels the shape it stands in, and the shape centres it. A block of writing
     * is not - prose reads from a straight left edge, and a note ragged down both sides reads as damage.
     */
    protected centersLines(element: GEditableLabel): boolean {
        return hasArgs(element) && element.args['wrapAtSpaces'] === true;
    }
}

function splitWords(text: string): string[] {
    return text.split(/\s+/).filter(word => word.length > 0);
}

/**
 * The text filled into lines of at most `columns` characters, broken at the blanks between words.
 *
 * A word goes onto the line being filled while it still fits and starts a new one when it does not. One
 * longer than a whole line is left whole on a line of its own rather than cut: breaking inside a word
 * turns a readable overhang into an unreadable line, and the shape it is written in can be dragged wider.
 *
 * Counted in characters rather than measured, because there is nothing to measure against yet - the
 * break has to be decided before the label is laid out, which is why the count is worked out from the
 * shape's own width and handed over in `wrapAtColumns`.
 */
function fillLines(text: string, columns: number): string[] {
    const words = splitWords(text);
    if (words.length === 0) {
        return [text];
    }

    const lines: string[] = [];
    let line = '';
    for (const word of words) {
        const candidate = line.length === 0 ? word : `${line} ${word}`;
        if (line.length === 0 || candidate.length <= columns) {
            line = candidate;
        } else {
            lines.push(line);
            line = word;
        }
    }
    lines.push(line);

    return lines;
}
