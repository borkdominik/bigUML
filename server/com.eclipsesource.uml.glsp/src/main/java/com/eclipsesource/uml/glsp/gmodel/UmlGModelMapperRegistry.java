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
package com.eclipsesource.uml.glsp.gmodel;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.internal.registry.MapRegistry;
import org.eclipse.glsp.server.registry.Registry;

import com.eclipsesource.uml.glsp.util.ReflectionUtil;
import com.google.inject.Inject;

public class UmlGModelMapperRegistry
   implements Registry<EObject, UmlGModelMapper<EObject, GModelElement>> {
   @SuppressWarnings("restriction")
   private final MapRegistry<String, UmlGModelMapper<EObject, GModelElement>> internalRegistry = new MapRegistry<>();
   private final Map<String, EObject> eobjects = new HashMap<>();

   @Inject
   public UmlGModelMapperRegistry(final Set<UmlGModelMapper<? extends EObject, ? extends GModelElement>> mappers) {
      System.out.println("");
      System.out.println("");
      mappers.forEach(mapper -> System.out.println("Mapper: " + mapper.getClass().getSimpleName()));
      System.out.println("");
      System.out.println("");

      mappers.forEach(mapper -> {
         ReflectionUtil.constructUml(mapper.deriveEObjectType())
            .ifPresent(eobject -> register(eobject, (UmlGModelMapper<EObject, GModelElement>) mapper));
      });

   }

   @Override
   public boolean register(final EObject key,
      final UmlGModelMapper<EObject, GModelElement> mapper) {
      final var strKey = deriveKey(key);
      eobjects.put(strKey, key);
      return internalRegistry.register(strKey, mapper);
   }

   @Override
   public boolean deregister(final EObject key) {
      return internalRegistry.deregister(deriveKey(key));
   }

   @Override
   public boolean hasKey(final EObject key) {
      return internalRegistry.hasKey(deriveKey(key));
   }

   @Override
   public Optional<UmlGModelMapper<EObject, GModelElement>> get(final EObject key) {
      return internalRegistry.get(deriveKey(key));
   }

   @Override
   public Set<UmlGModelMapper<EObject, GModelElement>> getAll() { return internalRegistry.getAll(); }

   @Override
   public Set<EObject> keys() {
      return internalRegistry.keys().stream().map(eobjects::get).collect(Collectors.toSet());
   }

   protected String deriveKey(final EObject key) {
      var derivedKey = key.getClass().getName();
      return derivedKey;
   }

}
