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
package com.eclipsesource.uml.modelserver.diagram.communication.lifeline;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.diagram.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.util.UmlNotationCommandUtil;

public class RemoveLifelineCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "removeLifeline";

   public static CCompoundCommand create(final Lifeline lifeline) {
      CCompoundCommand removeLifelineCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      removeLifelineCommand.setType(TYPE);
      removeLifelineCommand.getProperties().put(SEMANTIC_URI_FRAGMENT,
         UmlNotationCommandUtil.getSemanticProxyUri(lifeline));

      return removeLifelineCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      return new RemoveLifelineCompoundCommand(domain, modelUri, semanticUriFragment);
   }

}
