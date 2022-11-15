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

import com.eclipsesource.uml.modelserver.unotation.Representation;

@SuppressWarnings("restriction")
public abstract class DiagramSingleKeyRegistry<V> implements Registry<Representation, V> {
   protected final Map<String, Representation> keys = new HashMap<>();
   protected final MapRegistry<String, V> registry = new MapRegistry<>();

   protected String deriveKey(final Representation key) {
      return key.getName();
   }

   @Override
   public boolean register(final Representation key,
      final V value) {
      keys.put(deriveKey(key), key);
      return registry.register(deriveKey(key), value);
   }

   @Override
   public boolean deregister(final Representation key) {
      keys.remove(deriveKey(key));
      return registry.deregister(deriveKey(key));
   }

   @Override
   public boolean hasKey(final Representation key) {
      return registry.hasKey(deriveKey(key));
   }

   @Override
   public Optional<V> get(final Representation key) {
      return registry.get(deriveKey(key));
   }

   @Override
   public Set<V> getAll() { return registry.getAll(); }

   @Override
   public Set<Representation> keys() {
      return keys.values().stream().collect(Collectors.toSet());
   }

   protected void debug() {
      System.out.println("==== " + getClass().getName() + " ====");
      keys().forEach(key -> {
         System.out.println("Key: " + deriveKey(key) + " | Value: " + get(key).get().getClass().getName());
      });
      System.out.println("==== END ====");
   }
}
