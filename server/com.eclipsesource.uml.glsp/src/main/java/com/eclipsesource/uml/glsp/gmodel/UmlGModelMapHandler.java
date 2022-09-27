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

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.google.inject.Inject;

public class UmlGModelMapHandler {
   @Inject
   private UmlGModelMapperRegistry registry;

   public GModelElement handle(final EObject object) {
      var mapperOpt = registry.get(object);

      if (mapperOpt.isEmpty()) {
         throw new GLSPServerException("Error during model initialization!", new Throwable(
            "No matching GModelMapper found for the semanticElement of type: " + object.getClass().getSimpleName()));
      }

      return mapperOpt.get().map(object);
   }

   public List<GModelElement> handle(final List<EObject> objects) {
      return objects.stream().map(obj -> handle(obj)).collect(Collectors.toList());
   }
}
