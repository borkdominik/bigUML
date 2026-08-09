/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement, GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Actor } from '@borkdominik-biguml/uml-model-server/grammar';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import { representationTypeId } from '../../common/model/model-type-utils.js';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GActorNodeElementProps extends BaseElementProps {
    node: Actor;
}

export function GActorNodeElement(props: GActorNodeElementProps): GModelElement {
    // The figure is typed for the diagram the actor is in, not always for the use case one, so that each
    // diagram can draw it its own way - the information flow actor is a bigger figure with no box.
    const representation = props.type.split('__')[0];

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={props.size}
            cssClasses={['uml-node']}
            layout='vbox'
        >
            <GNodeElement
                id={`${props.node.__id}_stickfigure`}
                type={representationTypeId(representation, DefaultTypes.NODE, 'ActorStickfigure')}
            />
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} />
        </GNodeElement>
    );
}

export function createActorElement(ctx: ElementContext<Actor>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GActorNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
