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

import com.eclipsesource.uml.modelserver.shared.semantic.SemanticExistenceCheckedCommand;

public class RemoveMessageSemanticCommand extends SemanticExistenceCheckedCommand<Message> {

   public RemoveMessageSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Message message) {
      super(domain, modelUri, message);
   }

   @Override
   protected void doChanges() {
      var sendEvent = (MessageOccurrenceSpecification) semanticElement.getSendEvent();
      sendEvent.getCovereds().clear();

      var receiveEvent = (MessageOccurrenceSpecification) semanticElement.getReceiveEvent();
      receiveEvent.getCovereds().clear();

      var interaction = semanticElement.getInteraction();
      interaction.getFragments().remove(sendEvent);
      interaction.getFragments().remove(receiveEvent);
      interaction.getMessages().remove(semanticElement);
   }

}
