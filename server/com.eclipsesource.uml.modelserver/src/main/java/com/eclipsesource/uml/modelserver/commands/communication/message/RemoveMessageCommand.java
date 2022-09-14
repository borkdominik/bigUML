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
package com.eclipsesource.uml.modelserver.commands.communication.message;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveMessageCommand extends UmlSemanticElementCommand {

   protected final String semanticUriFragment;

   public RemoveMessageCommand(final EditingDomain domain, final URI modelUri,
      final String semanticUriFragment) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
   }

   @Override
   protected void doExecute() {
      Message messageToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Message.class);

      if (messageToRemove != null) {
         var sendEvent = (MessageOccurrenceSpecification) messageToRemove.getSendEvent();
         sendEvent.getCovereds().clear();

         var receiveEvent = (MessageOccurrenceSpecification) messageToRemove.getReceiveEvent();
         receiveEvent.getCovereds().clear();

         Interaction interaction = messageToRemove.getInteraction();
         interaction.getFragments().remove(sendEvent);
         interaction.getFragments().remove(receiveEvent);
         interaction.getMessages().remove(messageToRemove);
      }
   }

}
