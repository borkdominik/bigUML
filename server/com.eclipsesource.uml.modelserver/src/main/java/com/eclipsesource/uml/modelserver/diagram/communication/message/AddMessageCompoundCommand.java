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
package com.eclipsesource.uml.modelserver.diagram.communication.message;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.glsp.notation.commands.AddEdgeCommand;
import org.eclipse.uml2.uml.Message;

public class AddMessageCompoundCommand extends CompoundCommand {

   public AddMessageCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String sourceLifelineUriFragment, final String targetLifelineUriFragment) {

      // Chain semantic and notation command
      AddMessageCommand command = new AddMessageCommand(domain, modelUri, sourceLifelineUriFragment,
         targetLifelineUriFragment);
      this.append(command);
      Supplier<Message> semanticResultSupplier = () -> command.getNewMessage();
      this.append(new AddEdgeCommand(domain, modelUri, semanticResultSupplier));
   }

}
