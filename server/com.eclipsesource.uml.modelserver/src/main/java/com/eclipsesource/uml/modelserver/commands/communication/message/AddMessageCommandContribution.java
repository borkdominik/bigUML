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
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddMessageCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addMessageContributuion";
   public static final String SOURCE_LIFELINE_URI_FRAGMENT = "sourceLifelineUriFragment";
   public static final String TARGET_LIFELINE_URI_FRAGMENT = "targetLifelineUriFragment";

   public static CCompoundCommand create(final Lifeline sourceLifeline, final Lifeline targetLifeline) {
      CCompoundCommand addMessageCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addMessageCommand.setType(TYPE);
      addMessageCommand.getProperties().put(SOURCE_LIFELINE_URI_FRAGMENT,
         UmlSemanticCommandUtil.getSemanticUriFragment(sourceLifeline));
      addMessageCommand.getProperties().put(TARGET_LIFELINE_URI_FRAGMENT,
         UmlSemanticCommandUtil.getSemanticUriFragment(targetLifeline));
      return addMessageCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String sourceLifelineUriFragment = command.getProperties().get(SOURCE_LIFELINE_URI_FRAGMENT);
      String targetLifelineUriFragment = command.getProperties().get(TARGET_LIFELINE_URI_FRAGMENT);

      return new AddMessageCompoundCommand(domain, modelUri, sourceLifelineUriFragment, targetLifelineUriFragment);
   }

}
