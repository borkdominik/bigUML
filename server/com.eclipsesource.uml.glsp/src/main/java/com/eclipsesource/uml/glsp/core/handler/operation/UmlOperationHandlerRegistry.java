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

import org.eclipse.glsp.server.internal.registry.MapRegistry;
import org.eclipse.glsp.server.internal.util.ReflectionUtil;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.glsp.server.operations.OperationHandlerRegistry;

import com.google.inject.Inject;

@SuppressWarnings("restriction")
public class UmlOperationHandlerRegistry implements OperationHandlerRegistry {

   private final MapRegistry<String, OperationHandler> internalRegistry;
   private final Map<String, Operation> operations;

   @Inject
   public UmlOperationHandlerRegistry(final Set<OperationHandler> handlers) {
      operations = new HashMap<>();
      internalRegistry = new MapRegistry<>() {};
      handlers.forEach(handler -> {
         ReflectionUtil.construct(handler.getHandledOperationType())
            .ifPresent(operation -> register(operation, handler));
      });
   }

   protected String deriveKey(final Operation key) {
      return key.getClass().getName();
   }

   @Override
   public boolean register(final Operation key, final OperationHandler handler) {
      final String strKey = deriveKey(key);
      operations.put(strKey, key);
      return internalRegistry.register(strKey, handler);
   }

   @Override
   public boolean deregister(final Operation key) {
      return internalRegistry.deregister(deriveKey(key));
   }

   @Override
   public boolean hasKey(final Operation key) {
      return internalRegistry.hasKey(deriveKey(key));
   }

   @Override
   public Optional<OperationHandler> get(final Operation key) {
      return internalRegistry.get(deriveKey(key));
   }

   @Override
   public Set<OperationHandler> getAll() { return internalRegistry.getAll(); }

   @Override
   public Set<Operation> keys() {
      return internalRegistry.keys().stream().map(operations::get).collect(Collectors.toSet());
   }

}
