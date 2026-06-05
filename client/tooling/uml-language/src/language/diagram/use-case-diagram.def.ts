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
import type { Association } from '../elements/association-element.def.js';
import type { Extend } from '../elements/extend-element.def.js';
import type { Generalization } from '../elements/generalization-element.def.js';
import type { Include } from '../elements/include-element.def.js';
import type { Subject } from '../elements/subject-element.def.js';
import type { UseCase } from '../elements/use-case-element.def.js';

// @ts-nocheck

@Glsp.defaults
export class UseCaseDiagram {
    diagramType: 'USE_CASE';
    entities?: Array<UseCaseDiagramNodes>;
    relations?: Array<UseCaseDiagramEdges>;
}

type UseCaseDiagramElements = UseCaseDiagramNodes | UseCaseDiagramEdges;

type UseCaseDiagramNodes = UseCase | Actor | Subject;

type UseCaseDiagramEdges = Include | Extend | Association | Generalization;
