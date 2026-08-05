/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GCompartmentElement, GLabelElement, GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Subject } from '@borkdominik-biguml/uml-model-server/grammar';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GSubjectNodeElementProps extends BaseElementProps {
    node: Subject;
}

export function GSubjectNodeElement(props: GSubjectNodeElementProps): GModelElement {
    const { node, position, size, type } = props;

    return (
        <GNodeElement
            id={node.__id}
            type={type}
            position={position}
            size={size}
            cssClasses={['uml-node', 'uml-subject-node']}
            layout='vbox'
            layoutOptions={{ hAlign: 'left', ...(size ? { prefWidth: size.width, prefHeight: size.height } : {}) }}
        >
            <GCompartmentElement
                id={`${node.__id}_comp_header`}
                type={DefaultTypes.COMPARTMENT_HEADER}
                layout='vbox'
                layoutOptions={{ hAlign: 'left' }}
            >
                <GLabelElement type={CommonModelTypes.LABEL_NAME} text={node.name} cssClasses={['uml-font-bold']} />
            </GCompartmentElement>
        </GNodeElement>
    );
}

export function createSubjectElement(ctx: ElementContext<Subject>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GSubjectNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
