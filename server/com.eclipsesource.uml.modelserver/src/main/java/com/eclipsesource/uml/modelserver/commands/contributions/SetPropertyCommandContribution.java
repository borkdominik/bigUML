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
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.commands.semantic.SetPropertyCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class SetPropertyCommandContribution extends UmlSemanticCommandContribution {

   public static final String TYPE = "setProperty";
   public static final String NEW_NAME = "newName";
   public static final String NEW_TYPE = "newType";
   public static final String NEW_BOUNDS = "newBounds";

   public static CCommand create(final String semanticUri, final String newName, final String newType,
      final String newBounds) {
      CCommand setPropertyCommand = CCommandFactory.eINSTANCE.createCommand();
      setPropertyCommand.setType(TYPE);
      setPropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setPropertyCommand.getProperties().put(NEW_NAME, newName);
      setPropertyCommand.getProperties().put(NEW_TYPE, newType);
      setPropertyCommand.getProperties().put(NEW_BOUNDS, newBounds);
      return setPropertyCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String newName = command.getProperties().get(NEW_NAME);
      Type newType = UmlSemanticCommandUtil.getType(domain, command.getProperties().get(NEW_TYPE));
      int newLowerBound = UmlSemanticCommandUtil.getLower(command.getProperties().get(NEW_BOUNDS));
      int newUpperBound = UmlSemanticCommandUtil.getUpper(command.getProperties().get(NEW_BOUNDS));

      return new SetPropertyCommand(domain, modelUri, semanticUriFragment, newName, newType, newLowerBound,
         newUpperBound);
   }

}
