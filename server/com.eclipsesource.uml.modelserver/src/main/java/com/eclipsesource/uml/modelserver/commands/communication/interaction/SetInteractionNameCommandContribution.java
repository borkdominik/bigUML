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
package com.eclipsesource.uml.modelserver.commands.communication.interaction;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.SetLifelineNameCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class SetInteractionNameCommandContribution extends UmlSemanticCommandContribution {

   public static final String TYPE = "setInteractionName";
   public static final String NEW_NAME = "newName";

   public static CCommand create(final Interaction interaction, final String newName) {
      CCommand setInteractionNameCommand = CCommandFactory.eINSTANCE.createCommand();
      setInteractionNameCommand.setType(TYPE);
      setInteractionNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT,
         UmlSemanticCommandUtil.getSemanticUriFragment(interaction));
      setInteractionNameCommand.getProperties().put(NEW_NAME, newName);
      return setInteractionNameCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String newName = command.getProperties().get(NEW_NAME);

      return new SetLifelineNameCommand(domain, modelUri, semanticUriFragment, newName);
   }

}
