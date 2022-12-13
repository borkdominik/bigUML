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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;

public class AddAssociationContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:add_association";
   public static final String TYPE_KEYWORD = "type_keyword";

   public static CCompoundCommand create(final Type source, final Type target,
      final String keyword) {
      var command = CCommandFactory.eINSTANCE.createCompoundCommand();

      command.setType(TYPE);
      command.getProperties().put(SemanticKeys.SOURCE_SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(source));
      command.getProperties().put(SemanticKeys.TARGET_SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(target));
      command.getProperties().put(TYPE_KEYWORD, keyword);

      return command;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var elementAccessor = new SemanticElementAccessor(modelUri, domain);

      var sourceElementId = command.getProperties().get(SemanticKeys.SOURCE_SEMANTIC_ELEMENT_ID);
      var targetElementId = command.getProperties().get(SemanticKeys.TARGET_SEMANTIC_ELEMENT_ID);
      var type = command.getProperties().get(TYPE_KEYWORD);

      var source = elementAccessor.getElement(sourceElementId, Type.class);
      var target = elementAccessor.getElement(targetElementId, Type.class);

      if (source.isPresent() && target.isPresent()) {
         return new AddAssociationCompoundCommand(domain, modelUri, source.get(), target.get(), type);
      }

      return new NoopCommand();
   }

}
