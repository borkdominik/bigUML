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

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.internal.registry.MapRegistry;
import org.eclipse.glsp.server.registry.Registry;

import com.eclipsesource.uml.modelserver.unotation.Representation;

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
      if (hasKey(key)) {
         printContent();
         throw new IllegalArgumentException(
            String.format("[%s] Key %s already exists with value %s. Tried to register with value %s",
               this.getClass().getSimpleName(), deriveKey(key),
               get(key).map(v -> v.getClass().getName()).orElse("Unknown"),
               value.getClass().getName()));
      }
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

   public Optional<V> get(final Representation representation, final K key) {
      return get(new RepresentationKey<>(representation, key));
   }

   public V access(final RepresentationKey<K> key) {
      return this.get(key).orElseThrow(
         () -> {
            printContent();
            return new NoSuchElementException(
               String.format("[%s] No value found for representation %s and key %s",
                  this.getClass().getSimpleName(), key.representation.getName(), deriveKey(key)));
         });
   }

   public V access(final Representation representation, final K key) {
      return access(RepresentationKey.of(representation, key));
   }

   public <TValue extends V> TValue accessTyped(
      final Representation representation,
      final K key) {
      return (TValue) access(representation, key);
   }

   public <TValue extends V> TValue accessTyped(
      final Representation representation,
      final K key,
      final Class<TValue> type) {
      return (TValue) access(representation, key);
   }

   @Override
   public Set<V> getAll() { return registry.getAll(); }

   public Set<V> getAll(final Representation representation) {
      return keys().stream().filter(k -> k.representation.equals(representation))
         .map(k -> access(k))
         .collect(Collectors.toSet());
   }

   @Override
   public Set<RepresentationKey<K>> keys() {
      return keys.values().stream().collect(Collectors.toSet());
   }

   public void printContent() {
      System.out.println("==== " + getClass().getName() + " ====");
      keys().stream().sorted((a, b) -> deriveKey(a).compareTo(deriveKey(b))).forEach(key -> {
         System.out.println("Key:\t" + deriveKey(key));
         System.out.println("Value:\t" + get(key).get().getClass().getName());
         System.out.println();
      });
      System.out.println("==== END ====");
   }
}
