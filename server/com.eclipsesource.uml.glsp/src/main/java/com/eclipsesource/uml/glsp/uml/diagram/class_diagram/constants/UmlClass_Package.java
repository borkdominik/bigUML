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

public class UmlClass_Package {

   public static final String ID = "package";
   public static final String ICON = CoreTypes.PRE_ICON + ID;
   public static final String TYPE_ID = CoreTypes.PRE_NODE + ID;

   public enum Property {
      NAME,
      URI,
      VISIBILITY_KIND,
      PACKAGE_IMPORTS,
      PACKAGE_MERGES;
   }

   private UmlClass_Package() {}
}
