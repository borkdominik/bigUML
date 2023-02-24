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
package com.eclipsesource.uml.glsp.core.features.label_edit;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSOperationHandler;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UmlLabelEditOperationHandler
   extends EMSOperationHandler<ApplyLabelEditOperation> {

   @Inject
   private DiagramLabelEditMapperRegistry registry;

   @Inject
   private UmlModelState modelState;

   @Inject
   private Suffix suffix;

   @Inject
   private ActionDispatcher actionDispatcher;

   @Override
   public void executeOperation(final ApplyLabelEditOperation operation) {
      var updateOperation = modelState.getRepresentation().map(representation -> {
         var labelId = operation.getLabelId();
         var elementId = suffix.extractId(labelId)
            .orElseThrow(() -> new GLSPServerException("No elementId found by extractor for label " + labelId));

         var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class,
            "Could not find semantic element for id '" + elementId + "', no edit label operation executed.");

         var mapper = registry.get(RepresentationKey.of(representation, semanticElement.getClass()))
            .orElseThrow(
               () -> {
                  registry.printContent();
                  return new GLSPServerException(
                     "No edit label mapper found for class " + semanticElement.getClass().getName());
               });

         return (Action) mapper
            .map(operation)
            .orElseThrow(
               () -> {
                  var label = getOrThrow(modelState.getIndex().get(labelId),
                     GLabel.class, "No GLabel found for label " + labelId);
                  return new GLSPServerException(
                     "No update operation found for label id " + operation.getLabelId() + " for label type "
                        + label.getType() + " in mapper "
                        + mapper.getClass().getName());
               });
      });

      updateOperation.ifPresent(o -> {
         this.actionDispatcher.dispatch(o);
      });
   }

   @Override
   public String getLabel() { return "Uml: Apply label"; }
}
