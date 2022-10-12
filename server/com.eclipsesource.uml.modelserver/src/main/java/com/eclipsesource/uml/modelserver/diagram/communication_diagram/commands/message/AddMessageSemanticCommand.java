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
package com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.diagram.base.semantic.UmlSemanticCommand;
import com.eclipsesource.uml.modelserver.diagram.util.UmlSemanticCommandUtil;

public class AddMessageSemanticCommand extends UmlSemanticCommand {

   private final Message newMessage;
   protected final Lifeline sourceLifeline;
   protected final Lifeline targetLifeline;

   public AddMessageSemanticCommand(final EditingDomain domain, final URI modelUri,
      final String sourceLifelineUriFragment, final String targetLifelineUriFragment) {
      super(domain, modelUri);
      this.newMessage = UMLFactory.eINSTANCE.createMessage();
      this.sourceLifeline = UmlSemanticCommandUtil.getElement(umlModel, sourceLifelineUriFragment, Lifeline.class);
      this.targetLifeline = UmlSemanticCommandUtil.getElement(umlModel, targetLifelineUriFragment, Lifeline.class);
   }

   public AddMessageSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Lifeline source, final Lifeline target) {
      super(domain, modelUri);
      this.newMessage = UMLFactory.eINSTANCE.createMessage();
      this.sourceLifeline = source;
      this.targetLifeline = target;
   }

   @Override
   protected void doExecute() {
      var interaction = sourceLifeline.getInteraction();

      newMessage.setName(UmlSemanticCommandUtil.getNewMessageName(interaction));
      newMessage.setInteraction(interaction);

      var sendEvent = UMLFactory.eINSTANCE.createMessageOccurrenceSpecification();
      sendEvent.setName(newMessage.getName() + " - SendEvent");
      sendEvent.setMessage(newMessage);
      sendEvent.setCovered(sourceLifeline);
      sendEvent.setEnclosingInteraction(interaction);

      var receiveEvent = UMLFactory.eINSTANCE.createMessageOccurrenceSpecification();
      receiveEvent.setName(newMessage.getName() + " - ReceiveEvent");
      receiveEvent.setMessage(newMessage);
      receiveEvent.setCovered(targetLifeline);
      receiveEvent.setEnclosingInteraction(interaction);

      newMessage.setSendEvent(sendEvent);
      newMessage.setReceiveEvent(receiveEvent);
   }

   public Message getNewMessage() { return newMessage; }

}
