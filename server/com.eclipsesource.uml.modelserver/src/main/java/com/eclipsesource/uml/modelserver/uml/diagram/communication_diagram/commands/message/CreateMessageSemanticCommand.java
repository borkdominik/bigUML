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
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateMessageSemanticCommand extends BaseCreateSemanticRelationCommand<Lifeline, Lifeline, Message> {

   public CreateMessageSemanticCommand(final ModelContext context,
      final Lifeline source, final Lifeline target) {
      super(context, source, target);
   }

   @Override
   protected Message createSemanticElement(final Lifeline source, final Lifeline target) {
      var interaction = source.getInteraction();
      var nameGenerator = new ListNameGenerator(Message.class, interaction.getMessages());

      var message = interaction.createMessage(nameGenerator.newName());

      var sendEvent = UMLFactory.eINSTANCE.createMessageOccurrenceSpecification();
      sendEvent.setName(message.getName() + " - SendEvent");
      sendEvent.setMessage(message);
      sendEvent.setCovered(source);
      sendEvent.setEnclosingInteraction(interaction);

      var receiveEvent = UMLFactory.eINSTANCE.createMessageOccurrenceSpecification();
      receiveEvent.setName(message.getName() + " - ReceiveEvent");
      receiveEvent.setMessage(message);
      receiveEvent.setCovered(target);
      receiveEvent.setEnclosingInteraction(interaction);

      message.setSendEvent(sendEvent);
      message.setReceiveEvent(receiveEvent);

      return message;
   }

}
