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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.RemoveInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.RemoveLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.RemoveMessageCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class CommunicationDeleteOperationHandler
   extends EMSBasicOperationHandler<DeleteOperation, UmlModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final DeleteOperation operation, final UmlModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();

      operation.getElementIds().forEach(elementId -> {

         EObject semanticElement = getOrThrow(modelState.getIndex().getSemantic(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         // COMMUNICATION
         if (diagramType == Representation.COMMUNICATION) {
            if (semanticElement instanceof Interaction) {
               modelAccess.exec(RemoveInteractionCommandContribution.create((Interaction) semanticElement))
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Interaction: " + semanticElement.toString());
                     }
                  });
            } else if (semanticElement instanceof Lifeline) {
               modelAccess.exec(RemoveLifelineCommandContribution.create((Lifeline) semanticElement))
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Lifeline: " + semanticElement.toString());
                     }
                  });
            } else if (semanticElement instanceof Message) {
               modelAccess.exec(RemoveMessageCommandContribution.create((Message) semanticElement))
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Message: " + semanticElement.toString());
                     }
                  });
            }
         }
      });
   }

}
