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
package com.eclipsesource.uml.modelserver.shared.registry;

import java.util.List;
import java.util.stream.Collectors;

public abstract class DiagramClassRegistry<K extends Class<?>, V> extends DiagramMultiKeyRegistry<K, V> {

   @Override
   protected String deriveKey(final RepresentationKey<K> key) {
      var representation = key.representation;
      var clazz = key.key;

      if (clazz.isInterface()) {
         return representation.getName() + ":" + clazz;
      }

      var interfaces = List.of(clazz.getInterfaces());
      var keys = keys().stream().filter(k -> k.representation.equals(representation)).map(k -> k.key)
         .collect(Collectors.toSet());

      var found = keys.stream().filter(k -> interfaces.contains(k)).findFirst();
      if (found.isPresent()) {
         return representation.getName() + ":" + found.get();
      }

      return super.deriveKey(key);
   }

   public V access(final RepresentationKey<K> key) {
      return this.get(key).orElseThrow(
         () -> {
            printContent();
            return new IllegalArgumentException(
               String.format("[%s] No value found for representation %s and key %s",
                  this.getClass().getSimpleName(), key.representation.getName(), key.key.getClass().getSimpleName()));
         });
   }
}
