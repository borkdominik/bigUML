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
package com.eclipsesource.uml.glsp.core.features.label_edit;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.registry.DiagramClassRegistry;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramLabelEditMapperRegistry
   extends DiagramClassRegistry<Class<? extends EObject>, DiagramLabelEditMapper<EObject>> {

   @Inject
   public DiagramLabelEditMapperRegistry(
      final Map<Representation, Set<DiagramLabelEditMapper<? extends EObject>>> mappers) {
      mappers.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(mapper -> {
            var key = mapper.getElementType();
            register(RepresentationKey.of(representation, key),
               (DiagramLabelEditMapper<EObject>) mapper);
         });
      });
   }
}
