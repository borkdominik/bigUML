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

export namespace BaseTypes {
    export const COMP = "comp";
    export const COMPARTMENT = `${COMP}:${COMP}`;
    export const COMPARTMENT_HEADER = `${COMP}:header`;
    export const EDGE = "edge";
    export const GRAPH = "graph";
    export const ICON = "icon";
    export const HTML = "html";
    export const LABEL = "label";
    export const NODE = "node";
    export const PRE_RENDERED = "pre-rendered";
    export const ROUTING_POINT = "routing-point";
    export const VOLATILE_ROUTING_POINT = `volatile-${ROUTING_POINT}`;
}
