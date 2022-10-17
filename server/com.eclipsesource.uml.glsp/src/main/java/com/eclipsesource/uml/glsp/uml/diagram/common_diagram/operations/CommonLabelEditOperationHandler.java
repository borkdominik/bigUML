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
package com.eclipsesource.uml.glsp.uml.diagram.common_diagram.operations;

import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;

import com.eclipsesource.uml.glsp.core.handler.operation.DiagramEditLabelOperationHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class CommonLabelEditOperationHandler implements DiagramEditLabelOperationHandler {

   @Inject
   protected UmlModelState modelState;

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public boolean supports(final Representation representation) {
      return true;
   }

   @Override
   public void edit(final ApplyLabelEditOperation editLabelOperation) {
      /*-
      var modelIndex = modelState.getIndex();
      
      String inputText = editLabelOperation.getText().trim();
      String graphicalElementId = editLabelOperation.getLabelId();
      
      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");
      
      switch (label.getType()) {
      
         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getEObject(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");
      
            if (semanticElement instanceof Comment) {
               modelServerAccess.exec(SetBodyCommandContribution.create((Comment) semanticElement, inputText))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not change comment to: " + inputText);
                     }
                  });
            }
            break;
      }
      */
   }
}
