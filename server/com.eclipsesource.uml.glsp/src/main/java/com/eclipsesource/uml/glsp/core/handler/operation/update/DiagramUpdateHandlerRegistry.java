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
package com.eclipsesource.uml.glsp.core.handler.operation.update;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.common.DiagramMultiKeyRegistry;
import com.eclipsesource.uml.glsp.core.common.DoubleKey;
import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramUpdateHandlerRegistry
   extends
   DiagramMultiKeyRegistry<DoubleKey<Class<? extends EObject>, String>, DiagramUpdateHandler<? extends EObject, ?>> {

   @Inject
   public DiagramUpdateHandlerRegistry(
      final Map<Representation, Set<DiagramUpdateHandler<? extends EObject, ?>>> handlers) {
      handlers.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(handler -> {
            var elementType = handler.getElementType();
            var context = handler.contextId();
            register(RepresentationKey.of(representation, DoubleKey.of(elementType, context)), handler);
         });
      });

      // printContent();
   }

   @Override
   protected String deriveKey(final RepresentationKey<DoubleKey<Class<? extends EObject>, String>> key) {
      var representation = key.representation;
      var doubleKey = key.key;

      var clazz = doubleKey.key1;
      var origin = doubleKey.key2;

      if (clazz.isInterface()) {
         return "[" + representation.getName() + "]\t\t" + clazz + "\t" + origin;
      }

      var interfaces = List.of(clazz.getInterfaces());
      var dkeys = keys().stream().filter(k -> k.representation.equals(representation)).map(k -> k.key)
         .collect(Collectors.toSet());

      var found = dkeys.stream().filter(k -> interfaces.contains(k.key1)).findFirst();
      if (found.isPresent()) {
         return "[" + representation.getName() + "]\t\t" + found.get().key1 + "\t" + origin;
      }

      return super.deriveKey(key);
   }
}
