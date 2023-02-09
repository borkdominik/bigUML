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
package com.eclipsesource.uml.glsp.core.features.label_edit;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class LabelExtractor {

   @Inject
   protected Suffix suffix;

   @Inject
   protected UmlModelState modelState;

   public String extractElementId(final ApplyLabelEditOperation operation) {
      var labelId = operation.getLabelId();
      return suffix.extractId(labelId)
         .orElseThrow(() -> new GLSPServerException("No elementId found by extractor for label " + labelId));
   }

   public <TElement extends EObject> TElement extractElement(final ApplyLabelEditOperation operation,
      final Class<TElement> elementType) {
      var elementId = extractElementId(operation);
      return getOrThrow(modelState.getIndex().getEObject(elementId),
         elementType,
         "Could not find semantic element for id '" + elementId + "'. LabelExtractor failed.");
   }

   public GLabel extractLabel(final ApplyLabelEditOperation operation) {
      var labelId = operation.getLabelId();
      return getOrThrow(modelState.getIndex().get(labelId),
         GLabel.class, "No GLabel found for label " + labelId);
   }

   public String extractLabelSuffix(final ApplyLabelEditOperation operation) {
      var labelId = operation.getLabelId();
      return suffix.extractSuffix(labelId)
         .orElseThrow(() -> new GLSPServerException("No suffix found by extractor for label " + labelId));
   }
}
