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

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSCreateNodeOperationHandler;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.interaction.AddInteractionContribution;
import com.google.inject.Inject;

public class CreateInteractionNodeOperationHandler
   extends AbstractEMSCreateNodeOperationHandler {

   @Inject
   private UmlModelServerAccess modelServerAccess;

   public CreateInteractionNodeOperationHandler() {
      super(CommunicationTypes.INTERACTION);
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation) {

      switch (operation.getElementTypeId()) {
         case CommunicationTypes.INTERACTION: {
            modelServerAccess
               .exec(AddInteractionContribution.create(operation.getLocation().orElse(GraphUtil.point(0, 0))))
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create operation on new Interaction node");
                  }
               });
            break;
         }
      }
   }

   @Override
   public String getLabel() { return "Create communication interaction edge handler"; }

}
