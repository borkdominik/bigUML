/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Message;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message.UpdateMessageArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message.UpdateMessageContribution;

public final class UpdateMessageHandler extends BaseUpdateElementHandler<Message, UpdateMessageArgument> {

   public UpdateMessageHandler() {
      super(UmlSequence_Message.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Message element,
      final UpdateMessageArgument updateArgument) {
      return UpdateMessageContribution.create(element, updateArgument);
   }
}
