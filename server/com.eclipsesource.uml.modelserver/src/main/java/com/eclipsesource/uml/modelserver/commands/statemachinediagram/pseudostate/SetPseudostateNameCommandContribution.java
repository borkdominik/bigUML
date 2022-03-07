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
package com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class SetPseudostateNameCommandContribution extends UmlSemanticCommandContribution {

   public static final String TYPE = "setInitialStateName";
   public static final String NEW_NAME = "newName";

   public static CCommand create(final String semanticUri, final String newName) {
      var setPseudostateNameCommand = CCommandFactory.eINSTANCE.createCommand();
      setPseudostateNameCommand.setType(TYPE);
      setPseudostateNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setPseudostateNameCommand.getProperties().put(NEW_NAME, newName);

      return setPseudostateNameCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      var semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      var newName = command.getProperties().get(NEW_NAME);

      return new SetPseudoStateNameCommand(domain, modelUri, semanticUriFragment, newName);
   }

}
