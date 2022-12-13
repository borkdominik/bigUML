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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveMessageSemanticCommand extends UmlSemanticElementCommand {

   protected final Message message;

   public RemoveMessageSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Message message) {
      super(domain, modelUri);
      this.message = message;
   }

   /*-
    * We first create all commands, then execute them afterwards,
    * therefore it can happen that the same message is tried to be removed multiple times.
    */
   @Override
   protected void doExecute() {
      if (message.eContainer() != null) {

         var sendEvent = (MessageOccurrenceSpecification) message.getSendEvent();
         sendEvent.getCovereds().clear();

         var receiveEvent = (MessageOccurrenceSpecification) message.getReceiveEvent();
         receiveEvent.getCovereds().clear();

         var interaction = message.getInteraction();
         interaction.getFragments().remove(sendEvent);
         interaction.getFragments().remove(receiveEvent);
         interaction.getMessages().remove(message);
      }
   }

}
