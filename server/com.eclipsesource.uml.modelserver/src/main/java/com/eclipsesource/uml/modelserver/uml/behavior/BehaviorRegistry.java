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
package com.eclipsesource.uml.modelserver.uml.behavior;

import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.registry.DiagramClassRegistry;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public class BehaviorRegistry
   extends DiagramClassRegistry<Class<? extends EObject>, Set<Behavior<? extends EObject>>> {

   @Inject
   public BehaviorRegistry(
      final Map<Representation, Set<Behavior<? extends EObject>>> providers) {
      providers.entrySet().forEach(e -> {
         var representation = e.getKey();

         var group = e.getValue().stream().collect(Collectors.groupingBy(Behavior::getElementType,
            Collectors.toSet()));

         group.forEach((key, value) -> {
            register(RepresentationKey.of(representation, key), value);
         });
      });

      // printContent();
   }

   public <TValue extends Behavior<? extends EObject>> Optional<TValue> get(final Representation representation,
      final Class<? extends EObject> key,
      final TypeLiteral<TValue> value) {
      var values = this.get(RepresentationKey.of(representation, key));
      return values.orElseGet(() -> new HashSet<>()).stream()
         .filter(b -> value.getRawType().isAssignableFrom(b.getClass()))
         .map(b -> (TValue) b)
         .findFirst();
   }

   public <TValue extends Behavior<? extends EObject>> TValue access(final Representation representation,
      final Class<? extends EObject> key,
      final TypeLiteral<TValue> value) {
      return get(representation, key, value)
         .orElseThrow(
            () -> {
               printContent();
               return new IllegalArgumentException(
                  String.format("[%s] No %s found for representation %s and element %s",
                     this.getClass().getSimpleName(), value.getRawType(), representation.getName(),
                     key.getSimpleName()));
            });
   }

   public <TValue extends Behavior<? extends EObject>> Set<TValue> getAll(final Representation representation,
      final TypeLiteral<TValue> value) {
      return getAll(representation).stream()
         .flatMap(v -> v.stream())
         .filter(b -> value.getRawType().isAssignableFrom(b.getClass()))
         .map(b -> (TValue) b)
         .collect(Collectors.toSet());
   }
}
