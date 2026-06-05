/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import 'reflect-metadata';
import type { Interaction } from '../elements/interaction-element.def.js';
import type { Lifeline } from '../elements/lifeline-element.def.js';
import type { Message } from '../elements/message-element.def.js';

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
