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
package com.eclipsesource.uml.modelserver.uml.command.create.node;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.registry.DiagramClassRegistry;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class CreateNodeCommandProviderRegistry
   extends DiagramClassRegistry<Class<? extends EObject>, Set<CreateNodeCommandProvider<? extends EObject, ?>>> {

   @Inject
   public CreateNodeCommandProviderRegistry(
      final Map<Representation, Set<CreateNodeCommandProvider<? extends EObject, ?>>> providers) {
      providers.entrySet().forEach(e -> {
         var representation = e.getKey();

         var group = e.getValue().stream().collect(Collectors.groupingBy(g -> g.getElementType(),
            Collectors.toSet()));

         group.forEach((key, values) -> {
            register(RepresentationKey.of(representation, key), values);
         });

      });

      // printContent();
   }

   public CreateNodeCommandProvider<?, ?> accessByParent(final ModelContext context, final Class<? extends EObject> key,
      final Object parent) {
      var handlers = super.access(context.representation(), key);

      return handlers.stream().filter(h -> {
         var parentClass = parent.getClass();
         var handlerClass = h.getParentType();
         return handlerClass.isAssignableFrom(parentClass);
      }).findFirst()
         .orElseThrow(() -> {
            printContent();
            return new NoSuchElementException(
               String.format("[%s] No assignable parent %s found for representation %s to create %s. Handlers: %s",
                  this.getClass().getSimpleName(), parent.getClass().getSimpleName(), context.representation(), key,
                  String.join(", ", handlers.stream().map(h -> h.getClass().getName()).collect(Collectors.toList()))));
         });
   }
}
