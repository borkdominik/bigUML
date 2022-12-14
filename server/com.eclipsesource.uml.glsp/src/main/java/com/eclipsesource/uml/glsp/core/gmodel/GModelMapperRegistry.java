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
package com.eclipsesource.uml.glsp.core.gmodel;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.common.DiagramClassRegistry;
import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class GModelMapperRegistry
   extends DiagramClassRegistry<Class<? extends EObject>, GModelMapper<EObject, GModelElement>> {

   @Inject
   public GModelMapperRegistry(
      final Map<Representation, Set<GModelMapper<? extends EObject, ? extends GModelElement>>> mappers) {
      mappers.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(mapper -> {
            var key = mapper.getSourceType();
            register(RepresentationKey.of(representation, key),
               (GModelMapper<EObject, GModelElement>) mapper);
         });
      });

      // printContent();
   }
}
