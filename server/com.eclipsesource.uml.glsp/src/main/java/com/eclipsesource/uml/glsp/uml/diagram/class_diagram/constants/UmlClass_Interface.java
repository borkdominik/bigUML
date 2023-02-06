/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;

public class UmlClass_Interface {

   public static final String ID = "interface";
   public static final String TYPE_ID = CoreTypes.PRE_NODE + ID;

   public class Property {

      public static final String NAME = "name";
      public static final String IS_ABSTRACT = "is_abstract";
      public static final String VISIBILITY_KIND = "visibility_kind";

      private Property() {}
   }

   private UmlClass_Interface() {}
}
