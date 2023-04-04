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
package com.eclipsesource.uml.glsp.core.features.label_edit.validation;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.common.DiagramClassRegistry;
import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramLabelEditValidatorRegistry
   extends DiagramClassRegistry<Class<? extends EObject>, DiagramLabelEditValidator<? extends EObject>> {

   @Inject
   public DiagramLabelEditValidatorRegistry(
      final Map<Representation, Set<DiagramLabelEditValidator<? extends EObject>>> validators) {
      validators.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(validator -> {
            var types = validator.getElementTypes().size() > 0 ? validator.getElementTypes()
               : Set.of(validator.getElementType());
            types.forEach(type -> {
               register(RepresentationKey.of(representation, type), validator);
            });

         });
      });

      // printContent();
   }
}
