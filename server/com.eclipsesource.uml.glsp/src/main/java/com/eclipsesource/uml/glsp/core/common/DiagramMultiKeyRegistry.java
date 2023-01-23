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
package com.eclipsesource.uml.glsp.core.common;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.internal.registry.MapRegistry;
import org.eclipse.glsp.server.registry.Registry;

@SuppressWarnings("restriction")
public abstract class DiagramMultiKeyRegistry<K, V> implements Registry<RepresentationKey<K>, V> {
   protected final Map<String, RepresentationKey<K>> keys = new HashMap<>();
   protected final MapRegistry<String, V> registry = new MapRegistry<>();

   protected String deriveKey(final RepresentationKey<K> key) {
      var representation = key.representation;

      return representation.getName() + ":" + key.key;
   }

   @Override
   public boolean register(final RepresentationKey<K> key,
      final V value) {
      keys.put(deriveKey(key), key);
      return registry.register(deriveKey(key), value);
   }

   @Override
   public boolean deregister(final RepresentationKey<K> key) {
      keys.remove(deriveKey(key));
      return registry.deregister(deriveKey(key));
   }

   @Override
   public boolean hasKey(final RepresentationKey<K> key) {
      return registry.hasKey(deriveKey(key));
   }

   @Override
   public Optional<V> get(final RepresentationKey<K> key) {
      return registry.get(deriveKey(key));
   }

   @Override
   public Set<V> getAll() { return registry.getAll(); }

   @Override
   public Set<RepresentationKey<K>> keys() {
      return keys.values().stream().collect(Collectors.toSet());
   }

   public void printContent() {
      System.out.println("==== " + getClass().getName() + " ====");
      keys().forEach(key -> {
         System.out.println("Key:\t" + deriveKey(key));
         System.out.println("Value:\t" + get(key).get().getClass().getName());
         System.out.println();
      });
      System.out.println("==== END ====");
   }
}
