/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
/** @jsxImportSource @borkdominik-biguml/uml-glsp-server/jsx */
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement, GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Artifact } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import { nodeSize } from '../geometry/node-size.js';
import { type BaseElementProps, type ElementContext, renderContainedNodes } from './core/element-context.js';
import { FreeformCompartment } from './core/index.js';

export interface GArtifactNodeElementProps extends BaseElementProps {
    node: Artifact;
    /** What the element holds, drawn inside it - see `FreeformCompartment`. */
    freeformChildren?: GModelElement[];
}

export function GArtifactNodeElement(props: GArtifactNodeElementProps): GModelElement {
    // Held at the size it was given: the client lays the node out and would otherwise shrink it back
    // around its name after every resize.
    const size = nodeSize('Artifact', props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            // Its name in the middle of the box at whatever size it is dragged to, and at the top once the
            // box holds something (see `UmlCenteredVBoxLayouter`).
            layout='uml-centered-vbox'
            layoutOptions={{ prefWidth: size.width, prefHeight: size.height }}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} />
            {props.freeformChildren && <FreeformCompartment ownerId={props.node.__id}>{props.freeformChildren}</FreeformCompartment>}
        </GNodeElement>
    );
}

export function createArtifactElement(ctx: ElementContext<Artifact>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return (
        <GArtifactNodeElement
            node={ctx.node}
            position={position}
            size={size}
            type={ctx.elementType}
            freeformChildren={renderContainedNodes(ctx)}
        />
    );
}
