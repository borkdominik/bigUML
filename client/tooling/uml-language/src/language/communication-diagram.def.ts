/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import { Edge, Node, type Visibility } from './element.def.js';

// @ts-nocheck

@Glsp.defaults
export class CommunicationDiagram {
    diagramType: 'COMMUNICATION';
    entities?: Array<CommunicationDiagramNodes>;
    relations?: Array<CommunicationDiagramEdges>;
}

type CommunicationDiagramElements = CommunicationDiagramNodes | CommunicationDiagramEdges;

type CommunicationDiagramNodes = Interaction | Lifeline;

type CommunicationDiagramEdges = Message;

/**
 * CONTAINERS
 */

@Glsp.toolPalette({
    section: 'Container',
    label: 'Interaction',
    icon: 'uml-interaction-icon'
})
@Glsp.defaults
export class Interaction extends Node {
    name: string;
    visibility?: Visibility;
    lifelines?: Array<Lifeline>;
    messages?: Array<Message>;
}

/**
 * NODES
 */

@Glsp.toolPalette({
    section: 'Container',
    label: 'Lifeline',
    icon: 'uml-lifeline-icon'
})
@Glsp.defaults
export class Lifeline extends Node {
    name: string;
    visibility?: Visibility;
}

/**
 * EDGES
 */

@Glsp.toolPalette({
    section: 'Edges',
    label: 'Message',
    icon: 'uml-message-icon'
})
@Glsp.defaults
export class Message extends Edge {
    name?: string;
    visibility?: Visibility;
    @Language.reference source: Lifeline;
    @Language.reference target: Lifeline;
}
