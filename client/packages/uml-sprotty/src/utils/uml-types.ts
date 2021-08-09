/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { BaseTypes } from "./base-types";

export namespace UmlTypes {

    export const LABEL_NAME = `${BaseTypes.LABEL}:name`;
    export const LABEL_TEXT = `${BaseTypes.LABEL}:text`;
    export const LABEL_EDGE_NAME = `${BaseTypes.LABEL}:edge-name`;
    export const LABEL_EDGE_MULTIPLICITY = `${BaseTypes.LABEL}:edge-multiplicity`;
    export const ICON_CLASS = `${BaseTypes.ICON}:class`;
    export const LABEL_ICON = `${BaseTypes.LABEL}:${BaseTypes.ICON}`;
    export const CLASS = `${BaseTypes.NODE}:class`;
    export const ASSOCIATION = `${BaseTypes.EDGE}:association`;
    export const PROPERTY = `${BaseTypes.NODE}:property`;

}
