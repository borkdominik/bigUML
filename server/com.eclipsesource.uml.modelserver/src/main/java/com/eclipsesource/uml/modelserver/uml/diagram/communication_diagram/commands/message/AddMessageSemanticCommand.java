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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message;

import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;

public final class AddMessageSemanticCommand extends UmlSemanticElementCommand {

   protected final Message newMessage;
   protected final Lifeline sourceLifeline;
   protected final Lifeline targetLifeline;
   protected final NameGenerator nameGenerator;

   public AddMessageSemanticCommand(final ModelContext context,
      final Lifeline source, final Lifeline target) {
      super(context);
      this.newMessage = UMLFactory.eINSTANCE.createMessage();
      this.sourceLifeline = source;
      this.targetLifeline = target;
      this.nameGenerator = new ListNameGenerator(Message.class, source.getInteraction().getMessages());
   }

   @Override
   protected void doExecute() {
      var interaction = sourceLifeline.getInteraction();

      newMessage.setName(nameGenerator.newName());
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
