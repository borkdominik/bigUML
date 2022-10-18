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
package com.eclipsesource.uml.glsp.core.handler.operation;

import java.util.Optional;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.common.DiagramRegistry;
import com.eclipsesource.uml.glsp.core.common.DoubleKey;
import com.eclipsesource.uml.glsp.core.type.TypeRegistry;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramDeleteHandlerRegistry
   extends DiagramRegistry<Class<? extends EObject>, DiagramDeleteHandler> {

   @Inject
   public DiagramDeleteHandlerRegistry(final Set<DiagramDeleteHandler> handlers,
      final TypeRegistry typeRegistry) {
      handlers.forEach(handler -> {
         var representation = handler.getRepresentation();
         var types = typeRegistry.get(representation).get();
         var clazz = types.get(handler.getHandledElementTypeId());
         register(DoubleKey.of(representation, clazz), handler);
      });
   }

   @Override
   protected String deriveKey(final DoubleKey<Representation, Class<? extends EObject>> key) {
      var representation = key.key1;
      var clazz = key.key2;

      return representation.getName() + ":" + clazz.getName();
   }

   @Override
   public Optional<DiagramDeleteHandler> get(final DoubleKey<Representation, Class<? extends EObject>> key) {
      var classKey = keys.keySet().stream().filter(cKey -> {
         var value = keys.get(cKey);

         return value.key1.equals(key.key1) && value.key2.isAssignableFrom(key.key2);
      }).findFirst();

      if (classKey.isPresent()) {
         return registry.get(classKey.get());
      }

      return Optional.empty();

   }

}
