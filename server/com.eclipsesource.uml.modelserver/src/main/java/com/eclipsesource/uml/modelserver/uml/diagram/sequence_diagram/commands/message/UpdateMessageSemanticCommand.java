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

import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageKind;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateMessageSemanticCommand
   extends BaseUpdateSemanticElementCommand<Message, UpdateMessageArgument> {

   public UpdateMessageSemanticCommand(final ModelContext context,
      final Message semanticElement,
      final UpdateMessageArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Message semanticElement,
      final UpdateMessageArgument updateArgument) {
      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
         if (semanticElement.getMessageKind() != MessageKind.FOUND_LITERAL) {
            semanticElement.getSendEvent().setName(arg + "SendEvent");
         }
         if (semanticElement.getMessageKind() != MessageKind.LOST_LITERAL) {
            semanticElement.getReceiveEvent().setName(arg + "ReceiveEvent");
         }
      });

      updateArgument.messageSort().ifPresent(arg -> {
         semanticElement.setMessageSort(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });

   }
}
