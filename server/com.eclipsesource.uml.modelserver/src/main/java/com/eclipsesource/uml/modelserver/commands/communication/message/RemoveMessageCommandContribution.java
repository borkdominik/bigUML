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

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;

public class RemoveMessageCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "removeMessage";

   public static CCompoundCommand create(final String semanticUri) {
      CCompoundCommand removeMessageCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      removeMessageCommand.setType(TYPE);
      removeMessageCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);

      return removeMessageCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      return new RemoveMessageCompoundCommand(domain, modelUri, semanticUriFragment);
   }

}
