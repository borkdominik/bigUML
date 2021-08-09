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

import org.eclipse.uml2.uml.Property;

public final class UmlLabelUtil {

   private UmlLabelUtil() {}

   public static String getTypeName(final Property property) {
      if (property.getType() != null) {
         String typeName = property.getType().getName();
         return String.format(" : %s", typeName);
      }
      return "";
   }

   public static String getMultiplicity(final Property property) {
      if (property.getLower() == property.getUpper()) {
         return String.format(" [%s]", property.getUpper() == -1 ? "*" : property.getUpper());
      }
      return String.format(" [%s..%s]", property.getLower(), property.getUpper() == -1 ? "*" : property.getUpper());
   }

}
