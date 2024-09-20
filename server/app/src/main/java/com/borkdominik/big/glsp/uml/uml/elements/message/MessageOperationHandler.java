/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.message;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.UMLFactory;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateEdgeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class MessageOperationHandler extends BGEMFEdgeOperationHandler<Message, Lifeline, Lifeline> {

   @Inject
   public MessageOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateEdgeSemanticCommand<Message, Lifeline, Lifeline, ?> createSemanticCommand(
      final CreateEdgeOperation operation, final Lifeline source, final Lifeline target) {
      var argument = UMLCreateEdgeCommand.Argument
         .<Message, Lifeline, Lifeline> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
            var interaction = s.getInteraction();
            var message = interaction.createMessage(null);

            var sendEvent = UMLFactory.eINSTANCE.createMessageOccurrenceSpecification();
            sendEvent.setMessage(message);
            sendEvent.setCovered(s);
            sendEvent.setEnclosingInteraction(interaction);

            var receiveEvent = UMLFactory.eINSTANCE.createMessageOccurrenceSpecification();
            receiveEvent.setMessage(message);
            receiveEvent.setCovered(t);
            receiveEvent.setEnclosingInteraction(interaction);

            message.setSendEvent(sendEvent);
            message.setReceiveEvent(receiveEvent);

            return message;
         })
         .initName(true)
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

}
