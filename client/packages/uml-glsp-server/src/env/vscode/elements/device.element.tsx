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
import type { Device } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GDeviceNodeElementProps extends BaseElementProps {
    node: Device;
}

export function GDeviceNodeElement(props: GDeviceNodeElementProps): GModelElement {
    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={props.size}
            cssClasses={['uml-node']}
            layout='vbox'
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} />
        </GNodeElement>
    );
}

export function createDeviceElement(ctx: ElementContext<Device>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GDeviceNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
