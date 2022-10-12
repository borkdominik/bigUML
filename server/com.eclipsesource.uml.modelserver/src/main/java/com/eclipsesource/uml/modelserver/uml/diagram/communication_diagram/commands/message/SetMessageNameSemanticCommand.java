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

import com.eclipsesource.uml.modelserver.uml.semantic.UmlSemanticElementCommand;

public class SetMessageNameSemanticCommand extends UmlSemanticElementCommand {

   protected final Message message;
   protected final String newName;

   public SetMessageNameSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Message message,
      final String newName) {
      super(domain, modelUri);
      this.message = message;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      message.setName(newName);
      message.getSendEvent().setName(message.getName() + " - SendEvent");
      message.getReceiveEvent().setName(message.getName() + " - ReceiveEvent");
   }

}
