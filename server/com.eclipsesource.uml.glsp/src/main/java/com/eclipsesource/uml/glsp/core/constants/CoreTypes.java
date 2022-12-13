/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.constants;

public class CoreTypes {
   // PREFIXES
   public static final String PRE_NODE = "node:";
   public static final String PRE_EDGE = "edge:";
   public static final String PRE_LABEL = "label:";
   public static final String PRE_COMP_BASE = "comp:";
   public static final String PRE_ICON = "icon:";

   public static final String LABEL_COMP = PRE_COMP_BASE + "label";
   public static final String COMPARTMENT = "comp";
   public static final String COMPARTMENT_HEADER = PRE_COMP_BASE + "header";

   // COMMONS
   public static final String LABEL_NAME = PRE_LABEL + "name"; // Editable
   public static final String LABEL_TEXT = PRE_LABEL + "text"; // Readonly
   public static final String LABEL_EDGE_NAME = PRE_LABEL + "edge-name";
   public static final String COMP = PRE_COMP_BASE + "comp";
   // public static final String COMP_HEADER = COMP_BASE + "header";
   public static final String LABEL_ICON = PRE_LABEL + "icon";

   private CoreTypes() {}
}
