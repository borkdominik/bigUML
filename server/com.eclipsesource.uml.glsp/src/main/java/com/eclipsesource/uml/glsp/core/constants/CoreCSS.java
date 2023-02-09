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

public class CoreCSS {
   public static final String NODE = "uml-node";
   public static final String EDGE = "uml-edge";
   public static final String ELLIPSE = "uml-ellipse";
   public static final String PACKAGEABLE_NODE = "uml-packageable-node";

   public static final String EDGE_DOTTED = "uml-edge-dotted";
   public static final String EDGE_DASHED = "uml-edge-dashed";

   public static final String LABEL_TRANSPARENT = "label-transparent";

   public enum Marker {
      NONE("marker-none"),
      TRIANGLE("marker-triangle"),
      TRIANGLE_EMPTY("marker-triangle-empty"),
      TENT("marker-tent"),
      DIAMOND("marker-diamond"),
      DIAMOND_EMPTY("marker-diamond-empty");

      public String css;

      Marker(final String css) {
         this.css = css;
      }

      public String start() {
         return css + "-start";
      }

      public String end() {
         return css + "-end";
      }
   }

   private CoreCSS() {}
}
