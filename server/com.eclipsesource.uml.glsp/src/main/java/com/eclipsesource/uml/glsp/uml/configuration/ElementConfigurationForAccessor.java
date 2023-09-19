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
package com.eclipsesource.uml.glsp.uml.configuration;

import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface ElementConfigurationForAccessor {
   Representation representation();

   ElementConfigurationRegistry configurationRegistry();

   default Boolean existsConfigurationFor(final Class<? extends EObject> configuration) {
      return existsConfigurationFor(Set.of(configuration));
   }

   default Boolean existsConfigurationFor(final Set<Class<? extends EObject>> configurations) {
      return configurations.stream().allMatch(c -> configurationRegistry().get(representation(), c).isPresent());
   }

   default Set<ElementConfiguration<?>> existingConfigurations(final Set<Class<? extends EObject>> configurations) {
      return configurations.stream()
         .filter(c -> existsConfigurationFor(Set.of(c)))
         .map(c -> (ElementConfiguration<?>) configurationFor(c))
         .collect(Collectors.toSet());
   }

   default <TConfiguration extends ElementConfiguration<?>> TConfiguration configurationFor(
      final Class<? extends EObject> elementType) {
      return configurationRegistry().accessTyped(representation(), elementType);
   }

   default <TConfiguration extends ElementConfiguration<?>> TConfiguration configurationFor(
      final Class<? extends EObject> elementType, final Class<TConfiguration> configuration) {
      return configurationRegistry().accessTyped(representation(), elementType, configuration);
   }
}
