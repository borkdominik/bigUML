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
package com.eclipsesource.uml.glsp.util;

public final class UmlConfig {

   public static final class Types {

      public static final String LABEL_NAME = "label:name";
      public static final String LABEL_TEXT = "label:text";
      public static final String LABEL_EDGE_NAME = "label:edge-name";
      public static final String LABEL_EDGE_MULTIPLICITY = "label:edge-multiplicity";
      public static final String COMP = "comp:comp";
      public static final String COMP_HEADER = "comp:header";
      public static final String LABEL_ICON = "label:icon";
      public static final String ICON_CLASS = "icon:class";
      public static final String CLASS = "node:class";
      public static final String PROPERTY = "node:property";
      public static final String ASSOCIATION = "edge:association";

      private Types() {}
   }

   public static final class CSS {

      public static final String NODE = "uml-node";
      public static final String EDGE = "uml-edge";

      private CSS() {}
   }

   private UmlConfig() {}
}
