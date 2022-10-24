/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.handler.operation.directediting;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSOperationHandler;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.common.DoubleKey;
import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.features.idgenerator.SuffixIdExtractor;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UmlLabelEditOperationHandler
   extends AbstractEMSOperationHandler<ApplyLabelEditOperation> {

   @Inject
   private DiagramLabelEditHandlerRegistry registry;

   @Inject
   private UmlModelState modelState;

   @Inject
   private SuffixIdExtractor suffixIdExtractor;

   @Override
   public void executeOperation(final ApplyLabelEditOperation operation) {
      // TODO: Do not use instanceof etc.

      /*-
      UmlModelIndex modelIndex = modelState.getIndex();
      String inputText = operation.getText().trim();
      String graphicalElementId = operation.getLabelId();
      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");
      switch (label.getType()) {
         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getEObject(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");
            if (semanticElement instanceof Constraint) {
               modelAccess.setConditionBody(modelState, (Constraint) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not change constraint to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof NamedElement) {
               modelAccess.renameElement(modelState, (NamedElement) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not change named element to: " + inputText);
                     }
                  });
            }
            break;
      }
      */

      var representation = modelState.getUnsafeRepresentation();

      var labelId = operation.getLabelId();
      var suffix = suffixIdExtractor.extractSuffix(labelId)
         .orElseThrow(() -> new GLSPServerException("No suffix found by extractor for label " + labelId));
      var elementId = suffixIdExtractor.extractId(labelId)
         .orElseThrow(() -> new GLSPServerException("No elementId found by extractor for label " + labelId));

      var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
         EObject.class,
         "Could not find semantic element for id '" + elementId + "', no edit label operation executed.");

      var editLabelHandler = registry
         .get(RepresentationKey.of(representation, DoubleKey.of(semanticElement.getClass(), suffix)));

      editLabelHandler
         .orElseThrow(() -> new GLSPServerException("No handler found for labelId " + labelId))
         .executeLabelEdit(operation);
   }

   @Override
   public String getLabel() { return "Apply label"; }
}
