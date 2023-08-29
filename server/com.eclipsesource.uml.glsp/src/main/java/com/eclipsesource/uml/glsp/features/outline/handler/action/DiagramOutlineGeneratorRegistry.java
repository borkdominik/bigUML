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
package com.eclipsesource.uml.glsp.features.outline.handler.action;

import java.util.Map;

import com.eclipsesource.uml.glsp.features.outline.generator.DiagramOutlineGenerator;
import com.eclipsesource.uml.modelserver.shared.registry.DiagramSingleKeyRegistry;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramOutlineGeneratorRegistry
   extends DiagramSingleKeyRegistry<DiagramOutlineGenerator> {

   @Inject
   public DiagramOutlineGeneratorRegistry(
      final Map<Representation, DiagramOutlineGenerator> handlers) {
      handlers.entrySet().forEach(e -> {
         var representation = e.getKey();
         var generator = e.getValue();

         register(representation, generator);
      });

      // printContent();
   }
}
