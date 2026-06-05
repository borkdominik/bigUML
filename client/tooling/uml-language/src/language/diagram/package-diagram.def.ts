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
import type { Abstraction } from '../elements/abstraction-element.def.js';
import type { Class } from '../elements/class-element.def.js';
import type { Dependency } from '../elements/dependency-element.def.js';
import type { ElementImport } from '../elements/element-import-element.def.js';
import type { Operation } from '../elements/operation-element.def.js';
import type { Package } from '../elements/package-element.def.js';
import type { PackageImport } from '../elements/package-import-element.def.js';
import type { PackageMerge } from '../elements/package-merge-element.def.js';
import type { Parameter } from '../elements/parameter-element.def.js';
import type { Property } from '../elements/property-element.def.js';
import type { Usage } from '../elements/usage-element.def.js';

// @ts-nocheck

@Glsp.defaults
export class PackageDiagram {
    diagramType: 'PACKAGE';
    entities?: Array<PackageDiagramNodes>;
    relations?: Array<PackageDiagramEdges>;
}

type PackageDiagramElements = PackageDiagramNodes | PackageDiagramEdges;

type PackageDiagramNodes = Package | Class | Property | Operation | Parameter;

type PackageDiagramEdges = PackageImport | PackageMerge | ElementImport | Dependency | Abstraction | Usage;
