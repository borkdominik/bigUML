/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ActivityDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Activity } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import { FrameNameTag } from './core/index.js';
import type { BaseElementProps, ElementContext } from './core/element-context.js';
import { GPropertyRowElement } from './property.element.js';

export interface GActivityNodeElementProps extends BaseElementProps {
    node: Activity;
}

/**
 * An activity is the boundary its flow is drawn inside rather than a box the size of its own name, so it
 * opens big enough to drop that flow into. Kept in sync with the entry
 * `GenericCreateNodeOperationHandler` writes for a newly drawn activity.
 */
const DEFAULT_ACTIVITY_SIZE: Dimension = { width: 600, height: 400 };

/**
 * The smallest an activity is ever drawn or dragged to. Like the state machine frame, it must not shrink
 * onto its own name - a model written before it was laid out as a frame still carries label-sized bounds.
 * A constant rather than the frame's current size, which GLSP would read as a floor no resize may pass.
 */
const MIN_ACTIVITY_SIZE: Dimension = { width: 300, height: 200 };

/** Inset of the name from the frame border. */
const FRAME_PADDING = 8;


/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would accept - and the client layouter then collapses the frame onto its name.
 * Only positive dimensions count as a size someone chose.
 */
function frameSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_ACTIVITY_SIZE;
    }
    return {
        width: Math.max(size.width, MIN_ACTIVITY_SIZE.width),
        height: Math.max(size.height, MIN_ACTIVITY_SIZE.height)
    };
}

export function GActivityNodeElement(props: GActivityNodeElementProps): GModelElement {
    const size = frameSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            // A plain `vbox`, not the centred one the small shapes use: an activity's name belongs along
            // the top of the frame, over the flow drawn inside it, rather than in the middle of the box.
            layout='vbox'
            // The client lays this node out (`needsClientLayout`) and would otherwise shrink the frame down
            // to its name label. `prefWidth`/`prefHeight` hold a layouted node at a given size;
            // `minWidth`/`minHeight` are the floor a resize may not be dragged past. Both are needed: the
            // preferred size alone lets the frame be dragged down onto its name, and the floor alone is
            // ignored for layout as soon as a preferred size is set.
            layoutOptions={{
                // Along the top left, where UML writes a frame's name and the parameters under it - the
                // same corner the state machine frame puts its own name tag in.
                hAlign: 'left',
                paddingTop: FRAME_PADDING,
                paddingBottom: FRAME_PADDING,
                paddingLeft: FRAME_PADDING,
                paddingRight: FRAME_PADDING,
                minWidth: MIN_ACTIVITY_SIZE.width,
                minHeight: MIN_ACTIVITY_SIZE.height,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            {/* The same tag every other frame writes its name in - see the interaction and the subject.
                Not a bare label: `LABEL_TEXT` is drawn by sprotty's plain label view, which sets the text
                on the baseline of its own bounds, so the name hung above the frame's top edge instead of
                sitting inside it. The tag also carries the `_name_label` id a rename is written back
                through. Bold and larger than a node's own name, because this one titles everything drawn
                inside the frame. */}
            <FrameNameTag
                id={props.node.__id}
                name={props.node.name}
                nameCssClasses={['uml-font-bold', 'uml-font-frame-title']}
            />
            {/* Stacked straight under the name by the vbox above, which is where UML lists them. The class
                diagram's own property row, built by the same function, so a parameter reads and is edited
                here exactly as a class's property is - only the node type is the activity's. Rows of their
                own rather than lines of the frame's drawing, so each one can be clicked and edited. */}
            {(props.node.parameters ?? []).map(parameter =>
                GPropertyRowElement({ node: parameter, type: ActivityDiagramNodeTypes.PROPERTY })
            )}
        </GNodeElement>
    );
}

export function createActivityElement(ctx: ElementContext<Activity>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GActivityNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
