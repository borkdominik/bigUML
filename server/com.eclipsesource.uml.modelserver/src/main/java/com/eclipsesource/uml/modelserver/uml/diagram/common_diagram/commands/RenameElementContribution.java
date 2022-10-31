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
package com.eclipsesource.uml.modelserver.uml.diagram.common_diagram.commands;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;

public class RenameElementContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "uml:rename";

   private static final String NEW_NAME = "new_name";

   public static CCommand create(final NamedElement namedElement, final String newName) {
      var command = CCommandFactory.eINSTANCE.createCommand();
      command.setType(TYPE);
      command.getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID,
         SemanticElementAccessor.getId(namedElement));
      command.getProperties().put(NEW_NAME, newName);
      return command;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      var semanticUriFragment = command.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);
      var newName = command.getProperties().get(NEW_NAME);

      var model = new SemanticElementAccessor(modelUri, domain);
      var namedElement = model.getElement(semanticUriFragment,
         NamedElement.class);

      return new RenameElementSemanticCommand(domain, modelUri, namedElement, newName);
   }

}
