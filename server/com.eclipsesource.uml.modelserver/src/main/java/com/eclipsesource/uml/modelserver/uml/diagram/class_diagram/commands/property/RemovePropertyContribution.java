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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;

public class RemovePropertyContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:remove_property";

   public static CCommand create(final Class parent, final Property property) {
      var command = CCommandFactory.eINSTANCE.createCommand();

      command.setType(TYPE);
      command.getProperties().put(SemanticKeys.PARENT_SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(parent));
      command.getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(property));

      return command;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var elementAccessor = new SemanticElementAccessor(modelUri, domain);

      var parentSemanticElementId = command.getProperties().get(SemanticKeys.PARENT_SEMANTIC_ELEMENT_ID);
      var semanticElementId = command.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);

      var parent = elementAccessor.getElement(parentSemanticElementId, Class.class);
      var property = elementAccessor.getElement(semanticElementId, Property.class);

      if (parent.isPresent() && property.isPresent()) {
         return new RemovePropertySemanticCommand(domain, modelUri, parent.get(), property.get());
      }

      return new NoopCommand();
   }

}
