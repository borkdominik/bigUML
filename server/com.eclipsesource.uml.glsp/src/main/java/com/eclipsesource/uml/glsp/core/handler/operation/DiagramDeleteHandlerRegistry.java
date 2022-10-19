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
package com.eclipsesource.uml.glsp.core.handler.operation;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.common.DiagramClassRegistry;
import com.eclipsesource.uml.glsp.core.common.DoubleKey;
import com.eclipsesource.uml.glsp.core.type.TypeRegistry;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramDeleteHandlerRegistry
   extends DiagramClassRegistry<Class<? extends EObject>, DiagramDeleteHandler> {

   @Inject
   public DiagramDeleteHandlerRegistry(final Map<Representation, Set<DiagramDeleteHandler>> handlers,
      final TypeRegistry typeRegistry) {
      handlers.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(handler -> {
            var clazz = typeRegistry.get(DoubleKey.of(representation, handler.getHandledElementTypeId())).get();
            register(DoubleKey.of(representation, clazz), handler);
         });
      });

      debug();
   }
}
