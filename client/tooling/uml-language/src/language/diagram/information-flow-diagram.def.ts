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
import type { Actor } from '../elements/actor-element.def.js';
import type { Class } from '../elements/class-element.def.js';
import type { InformationFlow } from '../elements/information-flow-element.def.js';
import type { Operation } from '../elements/operation-element.def.js';
import type { Parameter } from '../elements/parameter-element.def.js';
import type { Property } from '../elements/property-element.def.js';

// @ts-nocheck

@Glsp.defaults
export class InformationFlowDiagram {
    diagramType: 'INFORMATION_FLOW';
    entities?: Array<InformationFlowDiagramNodes>;
    relations?: Array<InformationFlowDiagramEdges>;
}

type InformationFlowDiagramElements = InformationFlowDiagramNodes | InformationFlowDiagramEdges;

type InformationFlowDiagramNodes = Actor | Class | Property | Operation | Parameter;

type InformationFlowDiagramEdges = InformationFlow;
