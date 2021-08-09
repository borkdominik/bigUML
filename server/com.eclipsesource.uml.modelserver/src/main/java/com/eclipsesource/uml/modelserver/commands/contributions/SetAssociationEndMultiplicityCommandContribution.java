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
package com.eclipsesource.uml.modelserver.commands.contributions;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

import com.eclipsesource.uml.modelserver.commands.semantic.SetAssociationEndMultiplicityCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class SetAssociationEndMultiplicityCommandContribution extends UmlSemanticCommandContribution {

   public static final String TYPE = "setAssociationEndMultiplicity";
   public static final String NEW_BOUNDS = "newBounds";

   public static CCommand create(final String semanticUri, final String newBounds) {
      CCommand setAssociationEndMultiplicityCommand = CCommandFactory.eINSTANCE.createCommand();
      setAssociationEndMultiplicityCommand.setType(TYPE);
      setAssociationEndMultiplicityCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setAssociationEndMultiplicityCommand.getProperties().put(NEW_BOUNDS, newBounds);
      return setAssociationEndMultiplicityCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      int newLowerBound = UmlSemanticCommandUtil.getLower(command.getProperties().get(NEW_BOUNDS));
      int newUpperBound = UmlSemanticCommandUtil.getUpper(command.getProperties().get(NEW_BOUNDS));

      return new SetAssociationEndMultiplicityCommand(domain, modelUri, semanticUriFragment, newLowerBound,
         newUpperBound);
   }

}
