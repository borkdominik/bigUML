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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.feature.copy_paste.message;

public class CopyMessageCommand { /*- extends UmlSemanticElementCommand {

   protected final Message newMessage;
   protected final MessageCopyableProperties properties;
   protected final Lifeline sourceLifeline;
   protected final Lifeline targetLifeline;

   public CopyMessageCommand(final EditingDomain domain, final URI modelUri, final MessageCopyableProperties properties,
      final Lifeline source, final Lifeline target) {
      super(domain, modelUri);
      this.newMessage = UMLFactory.eINSTANCE.createMessage();
      this.properties = properties;
      this.sourceLifeline = source;
      this.targetLifeline = target;
   }

   @Override
   protected void doExecute() {
      var interaction = sourceLifeline.getInteraction();

      newMessage.setName(properties.getSemantic().name);
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
   */
}
