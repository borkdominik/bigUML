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
    type ArgsAware,
    containerFeature,
    type EditableLabel,
    type GChildElement,
    GCompartment,
    GLabel,
    hasArgs,
    isEditableLabel,
    layoutableChildFeature,
    nameFeature,
    RectangularNodeView,
    type RenderingContext,
    svg
} from '@eclipse-glsp/client';
import { type Args, DefaultTypes } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
// eslint-disable-next-line no-restricted-imports
import { alignFeature } from 'sprotty';
import { GLabeledNode } from '../../views/uml-label.view.js';

export class NamedElement extends GLabeledNode implements ArgsAware {
    static override readonly DEFAULT_FEATURES = [
        ...GLabeledNode.DEFAULT_FEATURES,
        nameFeature,
        containerFeature,
        alignFeature,
        layoutableChildFeature
    ];

    override get editableLabel(): (GChildElement & EditableLabel) | undefined {
        return find(this.children, isEditableLabel);
    }

    args: Args = {};

    override get name(): string {
        if (this.editableLabel) {
            return this.editableLabel.text;
        }

        const labels = filter(this.children, (pred): pred is GLabel => pred instanceof GLabel);
        if (labels.length > 0) {
            return labels.map(l => l.text).join(' ');
        }
        return this.id;
    }
}

function find<T extends GChildElement>(items: ReadonlyArray<GChildElement>, pred: (item: GChildElement) => item is T): T | undefined {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (pred(item)) {
            return item;
        }

        const found = find(item.children, pred);
        if (found) {
            return found;
        }
    }

    return undefined;
}

function filter<T extends GChildElement>(items: ReadonlyArray<GChildElement>, pred: (item: GChildElement) => item is T): T[] {
    const foundItems: T[] = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (pred(item)) {
            foundItems.push(item);
        }

        const found = filter(item.children, pred);
        foundItems.push(...found);
    }

    return foundItems;
}

@injectable()
export class NamedElementView extends RectangularNodeView {
    override render(element: NamedElement, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const compartment = element.children.find(
            c =>
                c instanceof GCompartment &&
                c.type !== DefaultTypes.COMPARTMENT_HEADER &&
                c.children.length > 0 &&
                hasArgs(c) &&
                c.args['divider'] === true
        ) as GCompartment | undefined;

        // TODO: Remove after switching to builder based approach for all gmodels
        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                {(element.args['border'] === true || element.args['build_by'] === undefined) && (
                    <rect
                        x={0}
                        y={0}
                        rx={2}
                        ry={2}
                        width={Math.max(0, element.bounds.width)}
                        height={Math.max(0, element.bounds.height)}
                        class-uml-node-background
                    />
                )}

                {compartment && (
                    <path
                        class-uml-comp-separator
                        d={`M 0,${compartment.position.y}  L ${element.bounds.width},${compartment.position.y}`}
                    ></path>
                )}

                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
