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
package com.eclipsesource.uml.modelserver.uml.command.create;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.registry.DiagramClassRegistry;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class CreateCommandProviderRegistry
   extends DiagramClassRegistry<Class<? extends EObject>, CreateCommandProvider<? extends EObject>> {

   @Inject
   public CreateCommandProviderRegistry(
      final Map<Representation, Set<CreateCommandProvider<? extends EObject>>> providers) {
      providers.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(handler -> {
            var elementType = handler.getElementType();
            register(RepresentationKey.of(representation, elementType), handler);
         });
      });

      // printContent();
   }
}
