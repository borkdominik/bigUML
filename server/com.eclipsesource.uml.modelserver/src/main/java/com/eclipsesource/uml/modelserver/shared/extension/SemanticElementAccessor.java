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
package com.eclipsesource.uml.modelserver.shared.extension;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;

public final class SemanticElementAccessor {
   private final Model model;

   public SemanticElementAccessor(final ModelContext context) {
      this(UmlSemanticUtil.getModel(context));
   }

   public SemanticElementAccessor(final Model model) {
      this.model = model;
   }

   public Model getModel() { return this.model; }

   public static String getId(final EObject element) {
      return EcoreUtil.getURI(element).fragment();
   }

   public static String getUnsafeId(final Object element) {
      return EcoreUtil.getURI((EObject) element).fragment();
   }

   public Optional<EObject> getElement(final String semanticElementId) {
      return Optional.ofNullable(model.eResource().getEObject(semanticElementId));
   }

   public <C> Optional<C> getElement(final String semanticElementId,
      final Class<C> clazz) {
      return getElement(semanticElementId).map(element -> {
         if (clazz.isAssignableFrom(element.getClass())) {
            return clazz.cast(element);
         }

         return null;
      });
   }

   public <T> List<T> getElements(
      final String[] semanticElementIds,
      final Class<T> type) {
      return this.getElements(Set.of(semanticElementIds), type);
   }

   public <T> List<T> getElements(
      final List<String> semanticElementIds,
      final Class<T> type) {
      return this.getElements(new HashSet<>(semanticElementIds), type);
   }

   public <T> List<T> getElements(
      final Set<String> semanticElementIds,
      final Class<T> type) {

      var elements = new ArrayList<T>();

      semanticElementIds.stream().map(semanticElementId -> {
         var mapped = getElement(semanticElementId, type);
         return mapped;
      }).forEach(element -> {
         element.ifPresent(elements::add);
      });

      return elements;
   }

   public <C extends EObject> Optional<C> getParentOfType(final EObject element,
      final Class<C> clazz) {

      var container = element.eContainer();

      while (container != null && !(clazz.isAssignableFrom(container.getClass()))) {
         container = container.eContainer();
      }

      if (container != null && !(container instanceof Model)) {
         return Optional.of(clazz.cast(container));
      }

      return Optional.empty();
   }

   public <C extends EObject> Optional<C> getParent(final EObject element,
      final Class<C> clazz) {

      var container = element.eContainer();

      if (container != null && !(container instanceof Model)) {
         return Optional.of(clazz.cast(container));
      }

      return Optional.empty();
   }

   @SuppressWarnings("unchecked")
   public <T extends Element> T refresh(final T element) {
      var id = getId(element);
      return (T) getElement(id).get();
   }
}
