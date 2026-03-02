/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import type { GlspNode } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { DividerElement, GCompartmentElement, GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';

// ============================================================================
// CompartmentHeader — shared header pattern for Class, Interface, DataType, etc.
// ============================================================================

export interface CompartmentHeaderProps {
    id: string;
    name: string;
    stereotype?: string;
    stereotypeCssClasses?: string[];
    isAbstract?: boolean;
}

export function CompartmentHeader(props: CompartmentHeaderProps): GModelElement {
    const { id, name, stereotype, stereotypeCssClasses, isAbstract } = props;

    const nameLabelCssClasses = ['uml-font-bold'];
    if (isAbstract) {
        nameLabelCssClasses.push('uml-font-italic');
    }

    return (
        <GCompartmentElement
            id={id + '_comp_header'}
            type={DefaultTypes.COMPARTMENT_HEADER}
            layout='vbox'
            layoutOptions={{ hAlign: 'center' }}
        >
            {isAbstract && !stereotype && <GLabelElement type={CommonModelTypes.LABEL_TEXT} text='<<abstract>>' />}
            {stereotype && (
                <GLabelElement
                    id={id + '_annotation_label'}
                    type={CommonModelTypes.LABEL_TEXT}
                    text={`<<${stereotype}>>`}
                    cssClasses={stereotypeCssClasses}
                />
            )}
            <GLabelElement
                id={id + '_name_label'}
                type={DefaultTypes.LABEL + ':name'}
                text={name}
                args={{ highlight: true }}
                cssClasses={nameLabelCssClasses}
            />
        </GCompartmentElement>
    );
}

// ============================================================================
// VisibilityLabel — maps visibility strings to symbols
// ============================================================================

export interface VisibilityLabelProps {
    id?: string;
    visibility: string;
}

export function getVisibilitySymbol(visibility: string): string {
    switch (visibility) {
        case 'PUBLIC':
            return '+';
        case 'PRIVATE':
            return '-';
        case 'PROTECTED':
            return '#';
        case 'PACKAGE':
            return '~';
        default:
            return '';
    }
}

export function VisibilityLabel(props: VisibilityLabelProps): GModelElement {
    return <GLabelElement id={props.id} type={CommonModelTypes.LABEL_TEXT} text={getVisibilitySymbol(props.visibility)} />;
}

// ============================================================================
// SectionCompartment — a vbox compartment used for properties/operations/slots sections
// ============================================================================

export interface SectionCompartmentProps {
    id: string;
    dividerText?: string;
    dividerType?: string;
    children?: GlspNode;
}

export function SectionCompartment(props: SectionCompartmentProps): GModelElement {
    return (
        <GCompartmentElement
            id={props.id}
            type={DefaultTypes.COMPARTMENT}
            layout='vbox'
            layoutOptions={{ hAlign: 'left', resizeContainer: true, hGrab: true }}
        >
            {props.dividerText && <DividerElement type={props.dividerType ?? CommonModelTypes.DIVIDER} text={props.dividerText} />}
            {props.children}
        </GCompartmentElement>
    );
}

// ============================================================================
// InlineCompartment — an hbox compartment used for inline row layouts (property rows, etc.)
// ============================================================================

export interface InlineCompartmentProps {
    id: string;
    type?: string;
    layoutOptions?: Record<string, any>;
    children?: GlspNode;
}

const defaultInlineOptions = {
    hGap: 3,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    resizeContainer: true
};

export function InlineCompartment(props: InlineCompartmentProps): GModelElement {
    return (
        <GCompartmentElement
            id={props.id}
            type={props.type ?? DefaultTypes.COMPARTMENT}
            layout='hbox'
            layoutOptions={props.layoutOptions ?? defaultInlineOptions}
        >
            {props.children}
        </GCompartmentElement>
    );
}
