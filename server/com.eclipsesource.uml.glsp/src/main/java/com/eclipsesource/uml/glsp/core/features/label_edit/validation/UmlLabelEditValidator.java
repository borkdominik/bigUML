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
package com.eclipsesource.uml.glsp.core.features.label_edit.validation;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.LabelEditValidator;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UmlLabelEditValidator implements LabelEditValidator {
   @Inject
   protected DiagramLabelEditValidatorRegistry registry;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected Suffix suffix;

   @Override
   public ValidationStatus validate(final String label, final GModelElement element) {
      return modelState.getRepresentation().<ValidationStatus> map(representation -> {
         var gmodelId = element.getId();
         var elementId = suffix.extractId(gmodelId)
            .orElseThrow(() -> new GLSPServerException("No elementId found by extractor for gmodel id " + gmodelId));

         var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class,
            "Could not find semantic element for id '" + elementId + "', no label edit validation executed.");

         var validator = registry.get(RepresentationKey.of(representation, semanticElement.getClass()));

         return validator.<ValidationStatus> map(v -> v.validate(label, element, semanticElement)).orElse(null);
      }).orElse(null);
   }

}
