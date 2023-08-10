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
package com.eclipsesource.uml.glsp.core.handler.operation.create;

import java.util.Map;
import java.util.Set;

import com.eclipsesource.uml.modelserver.shared.registry.DiagramMultiKeyRegistry;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramCreateEdgeHandlerRegistry
   extends DiagramMultiKeyRegistry<String, DiagramCreateEdgeHandler> {

   @Inject
   public DiagramCreateEdgeHandlerRegistry(final Map<Representation, Set<DiagramCreateEdgeHandler>> handlers) {
      handlers.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(handler -> {
            var elementId = handler.getElementTypeId();
            register(RepresentationKey.of(representation, elementId), handler);
         });
      });

      // printContent();
   }
}
