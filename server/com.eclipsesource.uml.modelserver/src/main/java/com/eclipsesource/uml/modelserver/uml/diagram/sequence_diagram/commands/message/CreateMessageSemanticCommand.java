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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message;

import java.util.function.Supplier;

import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageKind;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageSort;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateMessageSemanticCommand
   extends
   BaseCreateSemanticRelationCommand<Message, Supplier<MessageOccurrenceSpecification>, Supplier<MessageOccurrenceSpecification>> {

   protected final UmlMessageSort type;
   protected final UmlMessageKind kind;

   public CreateMessageSemanticCommand(final ModelContext context,
      final Supplier<MessageOccurrenceSpecification> occurrenceSpecification,
      final Supplier<MessageOccurrenceSpecification> occurrenceSpecification2,
      final UmlMessageSort type, final UmlMessageKind kind) {
      super(context, occurrenceSpecification, occurrenceSpecification2);
      this.type = type;
      this.kind = kind;
   }

   @Override
   protected Message createSemanticElement(final Supplier<MessageOccurrenceSpecification> sourceSupplier,
      final Supplier<MessageOccurrenceSpecification> targetSupplier) {

      Interaction interaction = null;

      if (source != null) {
         interaction = sourceSupplier.get().getEnclosingInteraction();
      } else {
         interaction = targetSupplier.get().getEnclosingInteraction();
      }
      ListNameGenerator nameGenerator = new ListNameGenerator(Message.class, interaction.getMessages());
      Message message = interaction.createMessage(nameGenerator.newName());

      if (source != null) {
         MessageOccurrenceSpecification sourceMessOccSpec = sourceSupplier.get();
         sourceMessOccSpec.setName(message.getName() + "SendEvent");
         sourceMessOccSpec.setMessage(message);
         message.setSendEvent(sourceMessOccSpec);
      } else {
         message.setSendEvent(null);
      }

      if (target != null) {
         MessageOccurrenceSpecification targetMessOccSpec = targetSupplier.get();
         targetMessOccSpec.setName(message.getName() + "ReceiveEvent");
         targetMessOccSpec.setMessage(message);
         message.setReceiveEvent(targetMessOccSpec);
      } else {
         message.setReceiveEvent(null);
      }

      message.setMessageSort(type.toMessageSort());

      return message;
   }

}
