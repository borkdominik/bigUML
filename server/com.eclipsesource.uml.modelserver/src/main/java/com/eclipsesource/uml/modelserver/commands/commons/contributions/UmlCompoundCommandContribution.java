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
package com.eclipsesource.uml.modelserver.commands.commons.contributions;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public abstract class UmlCompoundCommandContribution extends BasicCommandContribution<CompoundCommand> {

   public static final String SEMANTIC_URI_FRAGMENT = "semanticUriFragment";
   public static final String PARENT_SEMANTIC_URI_FRAGMENT = "parentSemanticUriFragment";

   protected static String getSemanticUriFragment(final Element element) {
      return EcoreUtil.getURI(element).fragment();
   }

   protected static <T extends Element> String toSemanticUriFragmentList(final List<T> elements) {
      var elementIds = elements.stream().map(i -> getSemanticUriFragment(i)).collect(Collectors.toList());
      return String.join(",", elementIds);
   }

   protected <T extends Element> List<T> fromSemanticUriFragmentList(final URI modelUri, final EditingDomain domain,
      final String[] elements,
      final Class<T> type) {
      var umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);

      return Arrays.asList(elements).stream().map(element -> {
         var mapped = UmlSemanticCommandUtil.getElement(umlModel, element, type);
         return mapped;
      }).collect(Collectors.toUnmodifiableList());
   }

   protected <T extends Element> T fromSemanticUriFragment(final URI modelUri, final EditingDomain domain,
      final String element, final Class<T> type) {
      var umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      return UmlSemanticCommandUtil.getElement(umlModel, element, type);
   }
}
