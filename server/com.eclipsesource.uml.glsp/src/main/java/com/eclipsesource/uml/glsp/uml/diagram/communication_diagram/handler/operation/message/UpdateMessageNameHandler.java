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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.message;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Message;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.UpdateNamedElementNameHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.RenameMessageContribution;

public final class UpdateMessageNameHandler extends UpdateNamedElementNameHandler<Message> {
   public UpdateMessageNameHandler() {
      super(UmlCommunication_Message.Property.NAME);
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Message element, final Args args) {
      return RenameMessageContribution.create(element, args.name);
   }
}
