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

public class UmlClass_PackageMerge {

   public static final String ID = "package-merge";
   public static final String TYPE_ID = CoreTypes.PRE_EDGE + ID;

   public enum Property {
      VISIBILITY_KIND,
      MERGED_PACKAGE;
   }

   private UmlClass_PackageMerge() {}
}
