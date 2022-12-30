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

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public final class SetMessageNameContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "communication:set_message_name";
   private static final String NEW_NAME = "new_name";

   public static CCommand create(final Message message, final String newName) {
      var command = CCommandFactory.eINSTANCE.createCommand();

      command.setType(TYPE);
      command.getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID,
         SemanticElementAccessor.getId(message));
      command.getProperties().put(NEW_NAME, newName);

      return command;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var context = ModelContext.of(modelUri, domain, command);
      var elementAccessor = new SemanticElementAccessor(context);

      var semanticElementId = command.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);
      var newName = command.getProperties().get(NEW_NAME);

      var message = elementAccessor.getElement(semanticElementId, Message.class);

      return message
         .<Command> map(m -> new SetMessageNameSemanticCommand(context, m, newName))
         .orElse(new NoopCommand());
   }

}
