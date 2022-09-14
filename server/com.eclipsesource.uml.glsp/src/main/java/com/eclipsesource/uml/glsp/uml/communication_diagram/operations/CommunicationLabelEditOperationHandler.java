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

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.operations.UmlDiagramLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.SetInteractionNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.SetLifelineNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.SetMessageNameCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class CommunicationLabelEditOperationHandler implements UmlDiagramLabelEditOperationHandler {

   @Inject
   protected UmlModelState modelState;

   @Override
   public boolean supports(final Representation representation) {
      return representation == Representation.COMMUNICATION;
   }

   @Override
   public void edit(final ApplyLabelEditOperation editLabelOperation, final UmlModelServerAccess modelAccess) {
      UmlModelIndex modelIndex = modelState.getIndex();

      String inputText = editLabelOperation.getText().trim();
      String graphicalElementId = editLabelOperation.getLabelId();

      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");

      switch (label.getType()) {

         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getSemantic(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");

            if (semanticElement instanceof Lifeline) {
               modelAccess
                  .exec(SetLifelineNameCommandContribution.create(
                     (Lifeline) semanticElement,
                     inputText))
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Lifeline to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Interaction) {
               modelAccess
                  .exec(SetInteractionNameCommandContribution.create((Interaction) semanticElement, inputText))
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Interaction to: " + inputText);
                     }
                  });
            }
            break;
         case Types.LABEL_EDGE_NAME:
            containerElementId = UmlIDUtil.getElementIdFromLabelName(graphicalElementId);
            semanticElement = getOrThrow(modelIndex.getSemantic(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");

            if (semanticElement instanceof Message) {
               modelAccess.exec(SetMessageNameCommandContribution.create((Message) semanticElement, inputText))
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Message Name to: " + inputText);
                     }
                  });
            }
            break;
      }
   }
}
