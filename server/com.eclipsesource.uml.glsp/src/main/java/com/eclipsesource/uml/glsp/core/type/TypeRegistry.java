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
package com.eclipsesource.uml.glsp.core.type;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.internal.registry.MapRegistry;
import org.eclipse.glsp.server.registry.Registry;

import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

@SuppressWarnings("restriction")
public class TypeRegistry implements Registry<Representation, Map<String, Class<? extends EObject>>> {

   private final MapRegistry<Representation, Map<String, Class<? extends EObject>>> internalRegistry;

   @Inject
   public TypeRegistry(
      @TypeMapping final Map<Representation, Map<String, Class<? extends EObject>>> mappings) {

      internalRegistry = new MapRegistry<>();
      mappings.forEach((key, value) -> register(key, value));
   }

   @Override
   public boolean register(final Representation key, final Map<String, Class<? extends EObject>> element) {
      return internalRegistry.register(key, element);
   }

   @Override
   public boolean deregister(final Representation key) {
      return internalRegistry.deregister(key);
   }

   @Override
   public boolean hasKey(final Representation key) {
      return internalRegistry.hasKey(key);
   }

   @Override
   public Optional<Map<String, Class<? extends EObject>>> get(final Representation key) {
      return internalRegistry.get(key);
   }

   @Override
   public Set<Map<String, Class<? extends EObject>>> getAll() { return internalRegistry.getAll(); }

   @Override
   public Set<Representation> keys() {
      return internalRegistry.keys();
   }

}
