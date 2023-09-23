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
package com.eclipsesource.uml.glsp.core.handler.operation.create;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.shared.registry.DiagramMultiKeyRegistry;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramCreateNodeHandlerRegistry
   extends DiagramMultiKeyRegistry<String, Set<DiagramCreateNodeHandler<?>>> {

   @Inject
   protected UmlModelState modelState;

   @Inject
   public DiagramCreateNodeHandlerRegistry(final Map<Representation, Set<DiagramCreateNodeHandler<?>>> handlers) {
      handlers.entrySet().forEach(e -> {
         var representation = e.getKey();

         var group = e.getValue().stream().collect(Collectors.groupingBy(g -> g.getElementTypeIds(),
            Collectors.toSet()));

         group.forEach((keys, values) -> {
            keys.forEach(key -> {
               register(RepresentationKey.of(representation, key), values);
            });
         });

      });

      // printContent();
   }

   public DiagramCreateNodeHandler<?> accessByParent(final Representation representation, final String key,
      final String parentId) {
      var handlers = super.access(representation, key);
      var parent = getOrThrow(modelState.getIndex().getEObject(parentId),
         EObject.class,
         String.format("[%s] No valid parent with id %s with type EObject found.", getClass().getSimpleName(),
            parentId));

      return handlers.stream().filter(h -> {
         var parentClass = parent.getClass();
         var handlerClass = h.getParentType();
         return handlerClass.isAssignableFrom(parentClass);
      }).findFirst()
         .orElseThrow(() -> {
            printContent();
            return new NoSuchElementException(
               String.format("[%s] No assignable parent %s found for representation %s to create %s. Handlers: %s",
                  this.getClass().getSimpleName(), parent.getClass().getSimpleName(), representation, key,
                  String.join(", ", handlers.stream().map(h -> h.getClass().getName()).collect(Collectors.toList()))));
         });
   }
}
