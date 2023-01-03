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

import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteMessageSemanticCommand extends BaseDeleteSemanticChildCommand<Interaction, Message> {

   public DeleteMessageSemanticCommand(final ModelContext context, final Message semanticElement) {
      super(context, semanticElement.getInteraction(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Interaction parent, final Message child) {
      var sendEvent = (MessageOccurrenceSpecification) child.getSendEvent();
      sendEvent.getCovereds().clear();

      var receiveEvent = (MessageOccurrenceSpecification) child.getReceiveEvent();
      receiveEvent.getCovereds().clear();

      parent.getFragments().remove(sendEvent);
      parent.getFragments().remove(receiveEvent);
      parent.getMessages().remove(child);
   }
}
