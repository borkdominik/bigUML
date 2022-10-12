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
package com.eclipsesource.uml.modelserver.uml.extension;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.resource.UMLResource;

public final class SemanticElementAccessor {
   private final Model model;

   public SemanticElementAccessor(final URI modelUri, final EditingDomain domain) {
      Resource semanticResource = domain.getResourceSet()
         .getResource(modelUri.trimFileExtension().appendFileExtension(UMLResource.FILE_EXTENSION), false);
      EObject semanticRoot = semanticResource.getContents().get(0);

      this.model = (Model) semanticRoot;
   }

   public SemanticElementAccessor(final Model model) {
      this.model = model;
   }

   public Model getModel() { return this.model; }

   public static String getId(final Element element) {
      return EcoreUtil.getURI(element).fragment();
   }

   public EObject getElement(final String semanticUriFragment) {
      return model.eResource().getEObject(semanticUriFragment);
   }

   public <C extends Element> C getElement(final String semanticUriFragment,
      final java.lang.Class<C> clazz) {
      var element = model.eResource().getEObject(semanticUriFragment);
      return clazz.cast(element);
   }

   public <T extends Element> List<T> getElements(
      final String[] elements,
      final java.lang.Class<T> type) {

      return Arrays.asList(elements).stream().map(element -> {
         var mapped = getElement(element, type);
         return mapped;
      }).collect(Collectors.toUnmodifiableList());
   }

   public <C extends Element> C getParent(final String semanticUriFragment,
      final java.lang.Class<C> clazz) {
      EObject container = getElement(
         semanticUriFragment, Element.class).eContainer();
      while (!(clazz.isAssignableFrom(container.getClass())) && container != null) {

         container = container.eContainer();

      }

      if (container != null && !(container instanceof Model)) {
         return clazz.cast(container);
      }

      return null;
   }

   @SuppressWarnings("unchecked")
   public <T extends Element> T refresh(final T element) {
      var id = getId(element);
      return (T) getElement(id);
   }
}
