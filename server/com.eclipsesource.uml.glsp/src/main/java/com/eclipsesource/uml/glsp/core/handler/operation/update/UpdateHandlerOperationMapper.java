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
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.TypeLiteral;
import com.google.inject.name.Names;
import com.google.inject.spi.ProviderInstanceBinding;

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

   public <THandler extends DiagramUpdateHandler<TElement>, TElement extends EObject, TUpdateArgument> UpdateOperation asOperation(
      final Class<THandler> handler,
      final TElement element,
      final TUpdateArgument args) {
      THandler instance = injector.getInstance(handler);
      return asOperation(instance, element, args);
   }

   public <THandler extends DiagramUpdateHandler<TElement>, TElement extends EObject, TUpdateArgument> UpdateOperation asOperation(
      final THandler handler,
      final TElement element,
      final TUpdateArgument args) {
      return asOperation(handler, element, args, new HashMap<>());
   }

   public <THandler extends DiagramUpdateHandler<TElement>, TElement extends EObject, TUpdateArgument> UpdateOperation asOperation(
      final THandler handler,
      final TElement element,
      final TUpdateArgument args,
      final Map<String, String> context) {

      var elementId = idGenerator.getOrCreateId(element);
      var type = new TypeToken<Map<String, Object>>() {}.getType();

      return new UpdateOperation(
         elementId,
         context,
         gson.fromJson(gson.toJsonTree(args), type));
   }

   public <THandler extends DiagramUpdateHandler<TElement>, TElement extends EObject, TUpdateArgument> Prepared<THandler, TElement, TUpdateArgument> prepare(
      final Class<THandler> handlerType, final TElement element) {
      return new Prepared<>(this.idGenerator, this.injector, Optional.empty(), handlerType, element);
   }

   public <THandler extends DiagramUpdateHandler<TElement>, TElement extends EObject, TUpdateArgument> Prepared<THandler, TElement, TUpdateArgument> prepare(
      final Representation representation, final Class<THandler> handlerType, final TElement element) {
      return new Prepared<>(this.idGenerator, this.injector, Optional.of(representation), handlerType, element);
   }

   public static class Prepared<THandler extends DiagramUpdateHandler<TElement>, TElement extends EObject, TUpdateArgument>
      extends UpdateHandlerOperationMapper {

      protected final Optional<Representation> representation;
      protected final Class<THandler> handlerType;
      protected final TElement element;

      public Prepared(final EMFIdGenerator idGenerator, final Injector injector,
         final Optional<Representation> representation, final Class<THandler> handlerType, final TElement element) {
         super(idGenerator, injector);

         this.representation = representation;
         this.handlerType = handlerType;
         this.element = element;
      }

      public UpdateOperation withArgument(
         final TUpdateArgument args) {
         return representation.map(r -> withArgument(r, args)).orElseGet(() -> {
            THandler instance = injector.getInstance(this.handlerType);
            return asOperation(instance, element, args);
         });
      }

      public UpdateOperation withArgument(
         final Representation representation,
         final TUpdateArgument args) {
         var updateBindings = injector
            .findBindingsByType(new TypeLiteral<Set<DiagramUpdateHandler<? extends EObject>>>() {}).stream()
            .filter(v -> {

               var key = v.getKey();
               var annotation = key.getAnnotation();
               if (annotation != null) {
                  return annotation.equals(Names.named("USE_CASE"));
               }

               return false;
            })
            .collect(Collectors.toList());

         for (var updateBinding : updateBindings) {
            if (updateBinding instanceof ProviderInstanceBinding) {
               var instanceBinding = (ProviderInstanceBinding<Set<DiagramUpdateHandler<? extends EObject>>>) updateBinding;
               var handlers = injector.getInstance(instanceBinding.getKey());

               for (var handler : handlers) {
                  if (handler.getClass().equals(this.handlerType)) {
                     return asOperation((THandler) handler, element, args);
                  }
               }

            }
         }

         throw new IllegalArgumentException(
            String.format("Could not find instance for handler %s in representation %s", handlerType, representation));
      }

   }
}
