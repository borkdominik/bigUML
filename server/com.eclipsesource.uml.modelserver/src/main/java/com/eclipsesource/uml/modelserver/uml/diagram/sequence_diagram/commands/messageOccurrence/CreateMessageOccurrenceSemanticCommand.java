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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence;

import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateMessageOccurrenceSemanticCommand
   extends BaseCreateSemanticChildCommand<Lifeline, MessageOccurrenceSpecification> {

   public CreateMessageOccurrenceSemanticCommand(final ModelContext context, final Lifeline parent) {
      super(context, parent);
   }

   @Override
   protected MessageOccurrenceSpecification createSemanticElement(final Lifeline parent) {
      var interaction = parent.getInteraction();
      var nameGenerator = new ListNameGenerator(MessageOccurrenceSpecification.class, interaction.getFragments());

      var event = (MessageOccurrenceSpecification) interaction.createFragment(nameGenerator.newName(),
         UMLPackage.Literals.MESSAGE_OCCURRENCE_SPECIFICATION);

      event.setCovered(parent);
      event.setEnclosingInteraction(parent.getInteraction());

      return event;
   }
}
