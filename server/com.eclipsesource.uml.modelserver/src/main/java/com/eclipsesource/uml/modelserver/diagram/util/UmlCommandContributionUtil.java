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
package com.eclipsesource.uml.modelserver.diagram.util;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Element;

public class UmlCommandContributionUtil {

   public static String getSemanticUriFragment(final Element element) {
      return EcoreUtil.getURI(element).fragment();
   }

   public static <T extends Element> String toSemanticUriFragmentList(final List<T> elements) {
      var elementIds = elements.stream().map(i -> getSemanticUriFragment(i)).collect(Collectors.toList());
      return String.join(",", elementIds);
   }

   public static <T extends Element> List<T> fromSemanticUriFragmentList(final URI modelUri, final EditingDomain domain,
      final String[] elements,
      final Class<T> type) {
      var umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);

      return Arrays.asList(elements).stream().map(element -> {
         var mapped = UmlSemanticCommandUtil.getElement(umlModel, element, type);
         return mapped;
      }).collect(Collectors.toUnmodifiableList());
   }

   public static <T extends Element> T fromSemanticUriFragment(final URI modelUri, final EditingDomain domain,
      final String element, final Class<T> type) {
      var umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      return UmlSemanticCommandUtil.getElement(umlModel, element, type);
   }

   private UmlCommandContributionUtil() {

   }
}
