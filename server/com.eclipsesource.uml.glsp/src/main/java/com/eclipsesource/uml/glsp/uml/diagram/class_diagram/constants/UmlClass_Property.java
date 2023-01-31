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

public class UmlClass_Property {

   public static final String ID = "property";
   public static final String ICON = CoreTypes.PRE_ICON + ID;
   public static final String TYPE_ID = CoreTypes.PRE_COMP_BASE + ID;

   public static final String LABEL_TYPE = CoreTypes.PRE_LABEL + ID + "-type";
   public static final String LABEL_MULTIPLICITY = CoreTypes.PRE_LABEL + ID + "-multiplicity";

   public class Property {

      public static final String NAME = "name";
      public static final String MULTIPLICITY = "multiplicity";
      public static final String TYPE = "type";

      private Property() {}
   }

   private UmlClass_Property() {}
}
