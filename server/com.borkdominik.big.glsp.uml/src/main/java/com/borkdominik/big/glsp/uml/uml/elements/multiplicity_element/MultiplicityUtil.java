/********************************************************************************
 * Copyright (c) 2022 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.multiplicity_element;

import java.util.regex.Pattern;

import org.eclipse.uml2.uml.MultiplicityElement;

public final class MultiplicityUtil {
   public static int getLower(final String multiplicityString) {
      return getBound(multiplicityString, 0);
   }

   public static int getUpper(final String multiplicityString) {
      return getBound(multiplicityString, 1);
   }

   public static boolean matches(final String multiplicityString) {
      return regex.matcher(multiplicityString).matches();
   }

   private static int getBound(final String multiplicityString, final int index) {
      String result = "";
      var multiplicity = multiplicityString.trim();
      var matcher = regex.matcher(multiplicity);
      if (matcher.matches()) {
         if (!multiplicity.contains("..")) {
            result = matcher.group(0);
         } else {
            result = matcher.group(index + 1);
         }
      }
      return result.isEmpty() ? 1 : (result.equals("*") ? -1 : Integer.parseInt(result, 10));
   }

   public static String getMultiplicity(final MultiplicityElement element) {
      if (element.getLower() == element.getUpper()) {
         return String.format("%s", element.getUpper() == -1 ? "*" : element.getUpper());
      }
      return String.format("%s..%s", element.getLower(), element.getUpper() == -1 ? "*" : element.getUpper());
   }

   public static Pattern regex = Pattern.compile("^(\\*|\\d+)\\.\\.(\\*|\\d+)$|^(\\d+)$");
}
