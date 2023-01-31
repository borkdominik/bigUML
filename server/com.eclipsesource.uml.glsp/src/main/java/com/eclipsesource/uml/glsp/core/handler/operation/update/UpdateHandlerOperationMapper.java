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
package com.eclipsesource.uml.glsp.core.handler.operation.update;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Injector;

public class UpdateHandlerOperationMapper {

   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   protected Injector injector;

   protected Gson gson;

   public UpdateHandlerOperationMapper() {
      this.gson = new Gson();
   }

   public <T extends DiagramUpdateHandler<TElementType, TArgs>, TElementType extends EObject, TArgs> UpdateOperation asOperation(
      final Class<T> handler,
      final TElementType element,
      final TArgs args) {
      var instance = injector.getInstance(handler);
      return asOperation(instance, element, args);
   }

   public <T extends DiagramUpdateHandler<TElementType, TArgs>, TElementType extends EObject, TArgs> UpdateOperation asOperation(
      final T handler,
      final TElementType element,
      final TArgs args) {
      return asOperation(handler, element, args, new HashMap<>());
   }

   public <T extends DiagramUpdateHandler<TElementType, TArgs>, TElementType extends EObject, TArgs> UpdateOperation asOperation(
      final T handler,
      final TElementType element,
      final TArgs args,
      final Map<String, String> context) {

      var elementId = idGenerator.getOrCreateId(element);
      var type = new TypeToken<Map<String, String>>() {}.getType();

      return new UpdateOperation(
         elementId,
         handler.contextId(),
         context,
         gson.fromJson(gson.toJsonTree(args), type));
   }

}
