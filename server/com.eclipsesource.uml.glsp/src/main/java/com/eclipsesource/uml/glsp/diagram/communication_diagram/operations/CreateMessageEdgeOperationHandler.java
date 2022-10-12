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
package com.eclipsesource.uml.glsp.diagram.communication_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import javax.inject.Inject;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSCreateEdgeOperationHandler;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.actions.ServerMessageAction;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.glsp.server.types.Severity;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message.AddMessageContribution;

public class CreateMessageEdgeOperationHandler
   extends AbstractEMSCreateEdgeOperationHandler {

   @Inject
   private ActionDispatcher actionDispatcher;

   @Inject
   protected UmlModelState modelState;

   @Inject
   private UmlModelServerAccess modelServerAccess;

   public CreateMessageEdgeOperationHandler() {
      super(CommunicationTypes.MESSAGE);
   }

   @Override
   public void executeOperation(final CreateEdgeOperation operation) {
      var elementTypeId = operation.getElementTypeId();
      var modelIndex = modelState.getIndex();

      Lifeline sourceLifeline = getOrThrow(modelIndex.getEObject(operation.getSourceElementId(), Lifeline.class),
         "No semantic Lifeline found for source element with id " + operation.getSourceElementId());
      Lifeline targetLifeline = getOrThrow(modelIndex.getEObject(operation.getTargetElementId(), Lifeline.class),
         "No semantic Lifeline found for target element with id" + operation.getTargetElementId());

      if (!sourceLifeline.getInteraction().equals(targetLifeline.getInteraction())) {
         actionDispatcher.dispatch(new ServerMessageAction(Severity.ERROR,
            "Connecting Lifelines between two different Interactions is not possible.",
            3000));
         return;
      }

      if (elementTypeId.equals(CommunicationTypes.MESSAGE)) {
         modelServerAccess
            .exec(AddMessageContribution.create(
               sourceLifeline,
               targetLifeline))
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Message edge");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create communication message edge handler"; }

}
