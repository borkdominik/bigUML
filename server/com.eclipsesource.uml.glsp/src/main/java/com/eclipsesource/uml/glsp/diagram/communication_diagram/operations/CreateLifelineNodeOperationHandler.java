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

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSCreateNodeOperationHandler;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.modelserver.diagram.communication.lifeline.AddLifelineCommandContribution;
import com.google.inject.Inject;

public class CreateLifelineNodeOperationHandler
   extends AbstractEMSCreateNodeOperationHandler {

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Inject
   private UmlModelState modelState;

   public CreateLifelineNodeOperationHandler() {
      super(CommunicationTypes.LIFELINE);
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation) {
      var containerId = operation.getContainerId();
      var elementTypeId = operation.getElementTypeId();

      PackageableElement container = getOrThrow(modelState.getIndex().getEObject(containerId),
         PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");

      switch (elementTypeId) {
         case CommunicationTypes.LIFELINE: {
            modelServerAccess
               .exec(AddLifelineCommandContribution.create(
                  (Interaction) container,
                  operation.getLocation().orElse(GraphUtil.point(0, 0))))
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create operation on new Lifeline node");
                  }
               });
            break;
         }
      }
   }

   @Override
   public String getLabel() { return "Create communication lifeline node handler"; }

}
