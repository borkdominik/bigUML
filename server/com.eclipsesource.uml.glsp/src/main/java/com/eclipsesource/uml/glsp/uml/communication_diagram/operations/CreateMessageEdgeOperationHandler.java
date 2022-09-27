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
package com.eclipsesource.uml.glsp.uml.communication_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import javax.inject.Inject;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.actions.ServerMessageAction;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.glsp.server.types.Severity;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.uml.communication_diagram.constants.CommunicationConfig;
import com.eclipsesource.uml.modelserver.commands.communication.message.AddMessageCommandContribution;
import com.google.common.collect.Lists;

public class CreateMessageEdgeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateEdgeOperation, UmlModelServerAccess> {

   @Inject
   private ActionDispatcher actionDispatcher;

   public CreateMessageEdgeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(CommunicationConfig.Types.MESSAGE);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateEdgeOperation) {
         CreateEdgeOperation action = (CreateEdgeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final CreateEdgeOperation operation, final UmlModelServerAccess modelAccess) {
      String elementTypeId = operation.getElementTypeId();

      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      Lifeline sourceLifeline = getOrThrow(modelIndex.getSemantic(operation.getSourceElementId(), Lifeline.class),
         "No semantic Lifeline found for source element with id " + operation.getSourceElementId());
      Lifeline targetLifeline = getOrThrow(modelIndex.getSemantic(operation.getTargetElementId(), Lifeline.class),
         "No semantic Lifeline found for target element with id" + operation.getTargetElementId());

      if (!sourceLifeline.getInteraction().equals(targetLifeline.getInteraction())) {
         actionDispatcher.dispatch(new ServerMessageAction(Severity.ERROR,
            "Connecting Lifelines between two different Interactions is not possible.",
            3000));
         return;
      }

      if (elementTypeId.equals(CommunicationConfig.Types.MESSAGE)) {
         modelAccess
            .exec(AddMessageCommandContribution.create(
               sourceLifeline,
               targetLifeline))
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Message edge");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create communication message edge handler"; }

}
