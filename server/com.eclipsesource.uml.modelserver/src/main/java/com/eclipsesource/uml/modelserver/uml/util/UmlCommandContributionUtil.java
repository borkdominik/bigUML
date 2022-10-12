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
package com.eclipsesource.uml.modelserver.uml.util;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Element;

public class UmlCommandContributionUtil {

   public static String getSemanticUriFragment(final Element element) {
      return EcoreUtil.getURI(element).fragment();
   }

   public static <T extends Element> String toSemanticUriFragmentList(final List<T> elements) {
      var elementIds = elements.stream().map(i -> getSemanticUriFragment(i)).collect(Collectors.toList());
      return String.join(",", elementIds);
   }

   private UmlCommandContributionUtil() {

   }
}
