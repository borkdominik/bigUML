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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.operations.DiagramDeleteOperationHandler;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.RemoveInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.RemoveLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.RemoveMessageCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class CommunicationDeleteOperationHandler implements DiagramDeleteOperationHandler {

   @Override
   public boolean supports(final Representation representation) {
      return representation == Representation.COMMUNICATION;
   }

   @Override
   public void delete(final EObject semanticElement, final UmlModelServerAccess modelAccess) {
      System.out.println("==== DELETE ====");
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

}
