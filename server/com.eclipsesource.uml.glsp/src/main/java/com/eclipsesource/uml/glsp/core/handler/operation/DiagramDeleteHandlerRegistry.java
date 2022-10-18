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

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.internal.registry.MapRegistry;
import org.eclipse.glsp.server.registry.Registry;

import com.eclipsesource.uml.glsp.core.type.TypeRegistry;
import com.google.inject.Inject;

@SuppressWarnings("restriction")
public class DiagramDeleteHandlerRegistry
   implements Registry<Class<? extends EObject>, DiagramDeleteHandler> {

   private final MapRegistry<String, DiagramDeleteHandler> internalRegistry;
   private final Map<String, Class<? extends EObject>> classes;

   @Inject
   public DiagramDeleteHandlerRegistry(final Set<DiagramDeleteHandler> handlers,
      final TypeRegistry typeRegistry) {
      classes = new HashMap<>();
      internalRegistry = new MapRegistry<>() {};
      handlers.forEach(handler -> {
         var types = typeRegistry.get(handler.getRepresentation()).get();
         var clazz = types.get(handler.getHandledElementTypeId());
         register(clazz, handler);
      });
   }

   protected String deriveKey(final Class<? extends EObject> key) {
      return deriveKey(key, null);
   }

   protected String deriveKey(final Class<? extends EObject> key, final String elementTypeId) {
      String derivedKey = key.getName();
      if (elementTypeId != null) {
         return derivedKey + "_" + elementTypeId;
      }
      return derivedKey;
   }

   @Override
   public boolean register(final Class<? extends EObject> key, final DiagramDeleteHandler handler) {
      classes.put(deriveKey(key), key);
      return internalRegistry.register(deriveKey(key), handler);
   }

   @Override
   public boolean deregister(final Class<? extends EObject> key) {
      classes.remove(deriveKey(key));
      return internalRegistry.deregister(deriveKey(key));
   }

   @Override
   public boolean hasKey(final Class<? extends EObject> key) {
      return internalRegistry.hasKey(deriveKey(key));
   }

   @Override
   public Optional<DiagramDeleteHandler> get(final Class<? extends EObject> key) {
      var classKey = classes.keySet().stream().filter(cKey -> {
         var value = classes.get(cKey);

         return value.isAssignableFrom(key);
      }).findFirst();

      if (classKey.isPresent()) {
         return internalRegistry.get(classKey.get());
      }

      return Optional.empty();

   }

   @Override
   public Set<DiagramDeleteHandler> getAll() { return internalRegistry.getAll(); }

   @Override
   public Set<Class<? extends EObject>> keys() {
      return classes.values().stream().collect(Collectors.toSet());
   }

}
