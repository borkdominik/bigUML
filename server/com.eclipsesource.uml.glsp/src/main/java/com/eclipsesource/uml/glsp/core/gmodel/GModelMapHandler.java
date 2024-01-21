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

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.google.inject.Inject;

public class GModelMapHandler {
   @Inject
   protected GModelMapperRegistry registry;

   @Inject
   protected UmlModelState modelState;

   public GModelElement handle(final EObject source) {
      var representation = modelState.getUnsafeRepresentation();
      var mapper = registry.access(RepresentationKey.of(representation, source.getClass()));

      return mapper.map(source);
   }

   public List<GModelElement> handle(final Collection<? extends EObject> sources) {
      return sources.stream().map(obj -> handle(obj)).collect(Collectors.toList());
   }

   public List<GModelElement> handleSiblings(final EObject source) {
      var representation = modelState.getUnsafeRepresentation();
      var mapperOpt = registry.get(RepresentationKey.of(representation, source.getClass()));

      if (mapperOpt.isEmpty()) {
         throw new GLSPServerException("Error during model initialization!", new Throwable(
            "No matching GModelMapper found for the semanticElement of type: " + source.getClass().getSimpleName()));
      }

      return mapperOpt.get().mapSiblings(source);
   }
}
