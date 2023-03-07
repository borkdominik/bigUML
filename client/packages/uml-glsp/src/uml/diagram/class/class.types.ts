/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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

import { DefaultTypes } from '@eclipse-glsp/client';

export namespace UmlClassTypes {
    export const CLASS = `${DefaultTypes.NODE}:class`;
    export const ABSTRACT_CLASS = `${DefaultTypes.NODE}:abstract-class`;

    export const ENUMERATION = `${DefaultTypes.NODE}:enumeration`;
    export const ENUMERATION_LITERAL = `${DefaultTypes.COMPARTMENT}:enumeration-literal`;

    export const INTERFACE = `${DefaultTypes.NODE}:interface`;

    export const ASSOCIATION = `${DefaultTypes.EDGE}:association`;
    export const AGGREGATION = `${DefaultTypes.EDGE}:aggregation`;
    export const COMPOSITION = `${DefaultTypes.EDGE}:composition`;
    export const CLASS_GENERALIZATION = `${DefaultTypes.EDGE}:generalization`;
    export const PROPERTY = `${DefaultTypes.COMPARTMENT}:property`;
    export const LABEL_PROPERTY_TYPE = `${DefaultTypes.LABEL}:property-type`;
    export const LABEL_PROPERTY_MULTIPLICITY = `${DefaultTypes.LABEL}:property-multiplicity`;
    export const OPERATION = `${DefaultTypes.COMPARTMENT}:operation`;
    export const DATA_TYPE = `${DefaultTypes.NODE}:data-type`;
    export const PRIMITIVE_TYPE = `${DefaultTypes.NODE}:primitive-type`;
    export const PACKAGE = `${DefaultTypes.NODE}:package`;
    export const ABSTRACTION = `${DefaultTypes.EDGE}:abstraction`;
    export const DEPENDENCY = `${DefaultTypes.EDGE}:dependency`;
    export const INTERFACE_REALIZATION = `${DefaultTypes.EDGE}:interface-realization`;
    export const REALIZATION = `${DefaultTypes.EDGE}:realization`;
    export const SUBSTITUTION = `${DefaultTypes.EDGE}:substitution`;
    export const USAGE = `${DefaultTypes.EDGE}:usage`;
    export const PACKAGE_IMPORT = `${DefaultTypes.EDGE}:package-import`;
    export const PACKAGE_MERGE = `${DefaultTypes.EDGE}:package-merge`;
}
