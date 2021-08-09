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
package com.eclipsesource.uml.glsp;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.internal.di.DIOperationHandlerRegistry;
import org.eclipse.glsp.server.internal.util.ReflectionUtil;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.glsp.server.operations.OperationHandlerRegistry;

import com.google.inject.Inject;

/**
 * <p>
 * Temporary workaround to support Ecore CreateOperations, until
 * https://github.com/eclipse-glsp/glsp/issues/21 is fixed.
 * </p>
 * <p>
 * The GLSP version {@link DIOperationHandlerRegistry} has special handling for
 * CreateOperations that requires 1 CreateOperationHandler per element type,
 * which doesn't match the current Ecore GLSP structure.
 * </p>
 */
@SuppressWarnings("restriction")
public class UmlDIOperationHandlerRegistry implements OperationHandlerRegistry {

   private final Map<String, List<OperationHandler>> internalRegistry;

   @Inject
   public UmlDIOperationHandlerRegistry(final Set<OperationHandler> handlers) {
      internalRegistry = new HashMap<>();
      handlers.forEach(handler -> {
         ReflectionUtil.construct(handler.getHandledOperationType())
            .ifPresent(operation -> register(operation, handler));
      });
   }

   @Override
   public boolean register(final Operation key, final OperationHandler handler) {
      String keyStr = deriveKey(key);
      List<OperationHandler> handlers;
      if (!internalRegistry.containsKey(keyStr)) {
         handlers = new ArrayList<>();
         internalRegistry.put(keyStr, handlers);
      } else {
         handlers = internalRegistry.get(keyStr);
         if (handlers == null) {
            return false;
         }
      }
      handlers.add(handler);
      return true;
   }

   @Override
   public boolean deregister(final Operation key) {
      return internalRegistry.remove(deriveKey(key)) != null;
   }

   @Override
   public boolean hasKey(final Operation key) {
      return internalRegistry.containsKey(deriveKey(key));
   }

   @Override
   public Optional<OperationHandler> get(final Operation key) {
      return Optional.ofNullable(internalRegistry.get(deriveKey(key)))
         .flatMap(list -> list.stream().filter(handler -> handler.handles(key)).findFirst());
   }

   @Override
   public Set<OperationHandler> getAll() {
      return internalRegistry.values().stream().flatMap(Collection::stream).collect(Collectors.toSet());
   }

   protected String deriveKey(final Operation key) {
      return key.getClass().getName();
   }

   @Override
   public Set<Operation> keys() {
      return null;
   }
}
