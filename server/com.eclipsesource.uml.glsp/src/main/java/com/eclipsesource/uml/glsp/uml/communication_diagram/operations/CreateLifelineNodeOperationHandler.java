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

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.uml.communication_diagram.constants.CommunicationConfig;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.AddLifelineCommandContribution;
import com.google.common.collect.Lists;

public class CreateLifelineNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

   public CreateLifelineNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(CommunicationConfig.Types.LIFELINE);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final UmlModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      String containerId = operation.getContainerId();
      String elementTypeId = operation.getElementTypeId();

      PackageableElement container = getOrThrow(modelState.getIndex().getSemantic(containerId),
         PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");

      switch (elementTypeId) {
         case CommunicationConfig.Types.LIFELINE: {
            modelAccess
               .exec(AddLifelineCommandContribution.create(
                  (Interaction) container,
                  operation.getLocation().orElse(GraphUtil.point(0, 0))))
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create operation on new Lifeline node");
                  }
               });
            break;
         }
      }
   }

   @Override
   public String getLabel() { return "Create communication lifeline edge handler"; }

}
