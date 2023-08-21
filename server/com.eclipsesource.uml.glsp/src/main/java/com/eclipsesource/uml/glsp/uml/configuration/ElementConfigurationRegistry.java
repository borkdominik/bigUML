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
package com.eclipsesource.uml.glsp.uml.configuration;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.registry.DiagramClassRegistry;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class ElementConfigurationRegistry
   extends DiagramClassRegistry<Class<? extends EObject>, ElementConfiguration<? extends EObject>> {

   @Inject
   public ElementConfigurationRegistry(
      final Map<Representation, Set<NodeConfiguration<? extends EObject>>> nodeConfigurations,
      final Map<Representation, Set<EdgeConfiguration<? extends EObject>>> edgeConfigurations) {

      nodeConfigurations.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(handler -> {
            register(RepresentationKey.of(representation, handler.getElementType()), handler);
         });
      });

      edgeConfigurations.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(handler -> {
            register(RepresentationKey.of(representation, handler.getElementType()), handler);
         });
      });

      // printContent();
   }

   public Optional<ElementConfiguration<? extends EObject>> get(final Representation representation,
      final Class<? extends EObject> key) {
      return super.get(new RepresentationKey<>(representation, key));
   }

   public <TConfiguration extends ElementConfiguration<? extends EObject>> TConfiguration accessTyped(
      final RepresentationKey<Class<? extends EObject>> key) {
      return (TConfiguration) access(key);
   }

   public <TConfiguration extends ElementConfiguration<? extends EObject>> TConfiguration accessTyped(
      final RepresentationKey<Class<? extends EObject>> key, final Class<TConfiguration> configuration) {
      return (TConfiguration) access(key);
   }
}
