/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import {
    ClassAstTypes,
    ClassDiagramEdgeTypes,
    ClassDiagramModelTypes,
    ClassDiagramNodeTypes,
    CommonModelTypes
} from '@borkdominik-biguml/uml-glsp-server';

/**
 * Backwards-compatible `ModelTypes` namespace that merges common model types
 * with the generated class-diagram-specific node and edge types.
 */
export namespace ModelTypes {
    // common types
    export const LABEL_HEADING = CommonModelTypes.LABEL_HEADING;
    export const LABEL_NAME = CommonModelTypes.LABEL_NAME;
    export const LABEL_TEXT = CommonModelTypes.LABEL_TEXT;
    export const COMP_HEADER = CommonModelTypes.COMP_HEADER;
    export const LABEL_ICON = CommonModelTypes.LABEL_ICON;
    export const EDGE = CommonModelTypes.EDGE;
    export const ICON = CommonModelTypes.ICON;
    export const DIVIDER = CommonModelTypes.DIVIDER;
    export const STRUCTURE = CommonModelTypes.STRUCTURE;
    export const MISSING_NODE = CommonModelTypes.MISSING_NODE;

    // container types (nodes)
    export const CLASS = ClassDiagramNodeTypes.CLASS;
    export const ABSTRACT_CLASS = ClassDiagramNodeTypes.ABSTRACT_CLASS;
    export const DATA_TYPE = ClassDiagramNodeTypes.DATA_TYPE;
    export const ENUMERATION = ClassDiagramNodeTypes.ENUMERATION;
    export const INSTANCE_SPECIFICATION = ClassDiagramNodeTypes.INSTANCE_SPECIFICATION;
    export const INTERFACE = ClassDiagramNodeTypes.INTERFACE;
    export const PACKAGE = ClassDiagramNodeTypes.PACKAGE;
    export const PRIMITIVE_TYPE = ClassDiagramNodeTypes.PRIMITIVE_TYPE;
    // feature types (nodes)
    export const PROPERTY = ClassDiagramNodeTypes.PROPERTY;
    export const OPERATION = ClassDiagramNodeTypes.OPERATION;
    export const PARAMETER = ClassDiagramNodeTypes.PARAMETER;
    export const ENUMERATION_LITERAL = ClassDiagramNodeTypes.ENUMERATION_LITERAL;
    export const SLOT = ClassDiagramNodeTypes.SLOT;
    export const LITERAL_SPECIFICATION = ClassDiagramNodeTypes.LITERAL_SPECIFICATION;
    // relation types (edges)
    export const ABSTRACTION = ClassDiagramEdgeTypes.ABSTRACTION;
    export const AGGREGATION = ClassDiagramEdgeTypes.AGGREGATION;
    export const ASSOCIATION = ClassDiagramEdgeTypes.ASSOCIATION;
    export const COMPOSITION = ClassDiagramEdgeTypes.COMPOSITION;
    export const DEPENDENCY = ClassDiagramEdgeTypes.DEPENDENCY;
    export const GENERALIZATION = ClassDiagramEdgeTypes.GENERALIZATION;
    export const INTERFACE_REALIZATION = ClassDiagramEdgeTypes.INTERFACE_REALIZATION;
    export const PACKAGE_IMPORT = ClassDiagramEdgeTypes.PACKAGE_IMPORT;
    export const PACKAGE_MERGE = ClassDiagramEdgeTypes.PACKAGE_MERGE;
    export const REALIZATION = ClassDiagramEdgeTypes.REALIZATION;
    export const SUBSTITUTION = ClassDiagramEdgeTypes.SUBSTITUTION;
    export const USAGE = ClassDiagramEdgeTypes.USAGE;
}

export { ClassAstTypes as astTypes, ClassDiagramEdgeTypes, ClassDiagramModelTypes, ClassDiagramNodeTypes };
