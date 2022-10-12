/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.utils;

public final class UmlConfig {

   public static final class Types {

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
      // TODO: Check difference between label name and text
      public static final String LABEL_NAME = PRE_LABEL + "name";
      public static final String LABEL_TEXT = PRE_LABEL + "text";
      public static final String LABEL_EDGE_NAME = PRE_LABEL + "edge-name";
      public static final String COMP = PRE_COMP_BASE + "comp";
      // public static final String COMP_HEADER = COMP_BASE + "header";
      public static final String LABEL_ICON = PRE_LABEL + "icon";

      private Types() {}
   }

   public static final class CSS {

      public static final String NODE = "uml-node";
      public static final String EDGE = "uml-edge";

      public static final String ELLIPSE = "uml-ellipse";
      public static final String PACKAGEABLE_NODE = "uml-packageable-node";
      public static final String EDGE_DOTTED = "uml-edge-dotted";
      public static final String EDGE_DASHED = "uml-edge-dashed";
      public static final String EDGE_DIRECTED_START = "uml-edge-directed-start";
      public static final String EDGE_DIRECTED_END = "uml-edge-directed-end";
      public static final String EDGE_DIRECTED_START_TENT = "uml-edge-directed-start-tent";
      public static final String EDGE_DIRECTED_END_TENT = "uml-edge-directed-end-tent";
      public static final String EDGE_DIRECTED_START_EMPTY = "uml-edge-directed-start-empty";
      public static final String EDGE_DIRECTED_END_EMPTY = "uml-edge-directed-end-empty";
      public static final String LABEL_TRANSPARENT = "label-transparent";

      private CSS() {}
   }

   private UmlConfig() {}
}
