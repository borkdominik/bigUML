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
import type { UseCase } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GUseCaseNodeElementProps extends BaseElementProps {
    node: UseCase;
}

export function GUseCaseNodeElement(props: GUseCaseNodeElementProps): GModelElement {
    const { size } = props;

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            layout='vbox'
            layoutOptions={{
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 15,
                paddingBottom: 15,
                ...(size ? { prefWidth: size.width, prefHeight: size.height } : {})
            }}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} cssClasses={['uml-font-usecase-name']} />
        </GNodeElement>
    );
}

export function createUseCaseElement(ctx: ElementContext<UseCase>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GUseCaseNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
