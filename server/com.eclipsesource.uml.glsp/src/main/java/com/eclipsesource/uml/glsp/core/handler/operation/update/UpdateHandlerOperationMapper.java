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

   protected final EMFIdGenerator idGenerator;
   protected final Injector injector;

   protected Gson gson;

   @Inject
   public UpdateHandlerOperationMapper(final EMFIdGenerator idGenerator, final Injector injector) {
      this.idGenerator = idGenerator;
      this.injector = injector;

      this.gson = new Gson();
   }

   public <THandler extends DiagramUpdateHandler<TElement, TUpdateArgument>, TElement extends EObject, TUpdateArgument> UpdateOperation asOperation(
      final Class<THandler> handler,
      final TElement element,
      final TUpdateArgument args) {
      THandler instance = injector.getInstance(handler);
      return asOperation(instance, element, args);
   }

   public <THandler extends DiagramUpdateHandler<TElement, TUpdateArgument>, TElement extends EObject, TUpdateArgument> UpdateOperation asOperation(
      final THandler handler,
      final TElement element,
      final TUpdateArgument args) {
      return asOperation(handler, element, args, new HashMap<>());
   }

   public <THandler extends DiagramUpdateHandler<TElement, TUpdateArgument>, TElement extends EObject, TUpdateArgument> UpdateOperation asOperation(
      final THandler handler,
      final TElement element,
      final TUpdateArgument args,
      final Map<String, String> context) {

      var elementId = idGenerator.getOrCreateId(element);
      var type = new TypeToken<Map<String, Object>>() {}.getType();

      return new UpdateOperation(
         elementId,
         handler.contextId(),
         context,
         gson.fromJson(gson.toJsonTree(args), type));
   }

   public <THandler extends DiagramUpdateHandler<TElement, TUpdateArgument>, TElement extends EObject, TUpdateArgument> Prepared<THandler, TElement, TUpdateArgument> prepare(
      final Class<THandler> handlerType, final TElement element) {
      return new Prepared<>(this.idGenerator, this.injector, handlerType, element);
   }

   public static class Prepared<THandler extends DiagramUpdateHandler<TElement, TUpdateArgument>, TElement extends EObject, TUpdateArgument>
      extends UpdateHandlerOperationMapper {

      protected final Class<THandler> handlerType;
      protected final TElement element;

      public Prepared(final EMFIdGenerator idGenerator, final Injector injector,
         final Class<THandler> handlerType, final TElement element) {
         super(idGenerator, injector);

         this.handlerType = handlerType;
         this.element = element;
      }

      public UpdateOperation withArgument(
         final TUpdateArgument args) {
         THandler instance = injector.getInstance(this.handlerType);
         return asOperation(instance, element, args);
      }

   }
}
