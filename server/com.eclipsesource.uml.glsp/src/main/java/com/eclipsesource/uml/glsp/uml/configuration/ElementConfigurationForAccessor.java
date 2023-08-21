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

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface ElementConfigurationForAccessor {
   Representation representation();

   ElementConfigurationRegistry configurationRegistry();

   default <TConfiguration extends ElementConfiguration<?>> Optional<TConfiguration> tryConfigurationFor(
      final Class<? extends EObject> elementType) {
      return (Optional<TConfiguration>) configurationRegistry().get(representation(), elementType);
   }

   default <TConfiguration extends ElementConfiguration<?>> TConfiguration configurationFor(
      final Class<? extends EObject> elementType) {
      return configurationRegistry().accessTyped(new RepresentationKey<>(representation(), elementType));
   }

   default <TConfiguration extends ElementConfiguration<?>> TConfiguration configurationFor(
      final Class<? extends EObject> elementType, final Class<TConfiguration> configuration) {
      return configurationRegistry().accessTyped(new RepresentationKey<>(representation(), elementType));
   }
}
